// MongoDB Atlas Data API 클라이언트
export class MongoDBDataAPI {
  constructor(apiUrl, apiKey, dataSource, database) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    this.dataSource = dataSource;
    this.database = database;
    this.collection = 'comments';
  }

  async request(endpoint, action, document = null, filter = null) {
    const body = {
      dataSource: this.dataSource,
      database: this.database,
      collection: this.collection,
      ...(document && { document }),
      ...(filter && { filter })
    };

    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.apiKey
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`MongoDB Data API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // 댓글 목록 조회
  async findComments() {
    const result = await this.request('/action/find', 'find', null, {
      isDeleted: false,
      isApproved: true
    });
    
    return result.documents.map(doc => ({
      id: doc._id,
      name: doc.name,
      message: doc.message,
      created_at: doc.createdAt
    }));
  }

  // 댓글 작성
  async insertComment(name, message, password) {
    // 비밀번호 해싱 (SHA-256)
    const hashedPassword = await this.hashPassword(password);
    
    const document = {
      name: name,
      message: message,
      password: hashedPassword,
      ipAddress: 'browser',
      isApproved: true,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await this.request('/action/insertOne', 'insertOne', document);
    return {
      success: true,
      id: result.insertedId,
      message: '댓글이 작성되었습니다.'
    };
  }

  // 댓글 삭제
  async deleteComment(commentId, password) {
    // 비밀번호 해싱
    const hashedPassword = await this.hashPassword(password);
    
    // 비밀번호 확인
    const findResult = await this.request('/action/findOne', 'findOne', null, {
      _id: { $oid: commentId },
      password: hashedPassword,
      isDeleted: false
    });

    if (!findResult.document) {
      throw new Error('댓글을 찾을 수 없거나 비밀번호가 일치하지 않습니다.');
    }

    // 소프트 삭제
    await this.request('/action/updateOne', 'updateOne', null, {
      filter: { _id: { $oid: commentId } },
      update: { 
        $set: { 
          isDeleted: true,
          updatedAt: new Date().toISOString()
        } 
      }
    });

    return {
      success: true,
      message: '댓글이 삭제되었습니다.'
    };
  }

  // SHA-256 해싱 (브라우저 Web Crypto API 사용)
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  // 댓글 수 조회
  async countComments() {
    const result = await this.request('/action/aggregate', 'aggregate', null, {
      pipeline: [
        { $match: { isDeleted: false, isApproved: true } },
        { $count: 'total' }
      ]
    });
    
    return { count: result.documents[0]?.total || 0 };
  }
}
