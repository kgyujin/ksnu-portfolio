export class CommentManager {
  constructor(apiClient) {
    this.api = apiClient;
    this.form = document.getElementById('comment-form');
    this.commentsList = document.getElementById('comments-list');
    this.commentCount = document.getElementById('comment-count');
    this.charCurrent = document.getElementById('char-current');
    this.contentTextarea = document.getElementById('comment-content');
  }

  async init() {
    if (!this.form || !this.commentsList) return;

    this.setupEventListeners();
    await this.loadComments();
  }

  setupEventListeners() {
    // 폼 제출
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.submitComment();
    });

    // 글자 수 카운트
    this.contentTextarea.addEventListener('input', () => {
      const length = this.contentTextarea.value.length;
      this.charCurrent.textContent = length;
      
      if (length > 500) {
        this.contentTextarea.value = this.contentTextarea.value.substring(0, 500);
        this.charCurrent.textContent = 500;
      }
    });

    // 입력 필드 XSS 방지 - 실시간 검증
    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', (e) => {
        // 위험한 태그 입력 차단
        if (this.containsDangerousContent(e.target.value)) {
          e.target.setCustomValidity('HTML 태그나 스크립트는 입력할 수 없습니다.');
        } else {
          e.target.setCustomValidity('');
        }
      });
    });
  }

  containsDangerousContent(text) {
    // 위험한 패턴 감지
    const dangerousPatterns = [
      /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
      /<iframe[\s\S]*?>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi, // onclick, onerror 등
      /<embed[\s\S]*?>/gi,
      /<object[\s\S]*?>/gi,
    ];

    return dangerousPatterns.some(pattern => pattern.test(text));
  }

  sanitizeInput(input) {
    if (!input) return '';
    
    // HTML 엔티티로 변환하여 XSS 방지
    const div = document.createElement('div');
    div.textContent = input;
    let sanitized = div.innerHTML;
    
    // 추가 보안 처리
    sanitized = sanitized
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
    
    return sanitized;
  }

  validateForm(username, password, content) {
    const errors = [];

    // 이름 검증
    if (!username || username.trim().length === 0) {
      errors.push('이름을 입력해주세요.');
    } else if (username.length > 50) {
      errors.push('이름은 50자 이내로 입력해주세요.');
    }

    // 비밀번호 검증
    if (!password || password.length < 4) {
      errors.push('비밀번호는 4자 이상 입력해주세요.');
    } else if (password.length > 20) {
      errors.push('비밀번호는 20자 이내로 입력해주세요.');
    }

    // 내용 검증
    if (!content || content.trim().length === 0) {
      errors.push('댓글 내용을 입력해주세요.');
    } else if (content.length > 500) {
      errors.push('댓글은 500자 이내로 입력해주세요.');
    }

    // 위험한 내용 검증
    if (this.containsDangerousContent(username) || 
        this.containsDangerousContent(content)) {
      errors.push('HTML 태그나 스크립트는 입력할 수 없습니다.');
    }

    return errors;
  }

  async submitComment() {
    const username = document.getElementById('comment-username').value.trim();
    const password = document.getElementById('comment-password').value;
    const content = document.getElementById('comment-content').value.trim();

    // 유효성 검사
    const errors = this.validateForm(username, password, content);
    if (errors.length > 0) {
      this.showError(errors.join('\n'));
      return;
    }

    // 제출 버튼 비활성화
    const submitBtn = this.form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '작성 중...';

    try {
      // 입력값 새니타이즈 (추가 보안)
      const sanitizedData = {
        name: this.sanitizeInput(username),
        password: password, // 비밀번호는 서버에서 해시 처리
        message: this.sanitizeInput(content)
      };

      await this.api.createComment(sanitizedData);
      
      // 폼 초기화
      this.form.reset();
      this.charCurrent.textContent = '0';
      
      // 댓글 목록 새로고침
      await this.loadComments();
      
      this.showSuccess('댓글이 작성되었습니다!');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      this.showError('댓글 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  async loadComments() {
    try {
      this.commentsList.innerHTML = '<div class="loading">댓글을 불러오는 중...</div>';
      
      const comments = await this.api.getComments();
      
      if (!comments || comments.length === 0) {
        this.commentsList.innerHTML = '<div class="no-comments">아직 댓글이 없습니다.<br>첫 댓글을 남겨보세요!</div>';
        this.updateCommentCount(0);
        return;
      }

      this.renderComments(comments);
      this.updateCommentCount(comments.length);
    } catch (error) {
      console.error('댓글 로딩 실패:', error);
      this.commentsList.innerHTML = '<div class="error-message">댓글을 불러오는데 실패했습니다.</div>';
    }
  }

  renderComments(comments) {
    this.commentsList.innerHTML = '';
    
    // 최신 댓글이 위로 오도록 정렬
    const sortedComments = [...comments].sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );

    sortedComments.forEach(comment => {
      const commentElement = this.createCommentElement(comment);
      this.commentsList.appendChild(commentElement);
    });
  }

  createCommentElement(comment) {
    const div = document.createElement('div');
    div.className = 'comment-item';
    div.dataset.commentId = comment.id;

    // 아바타 이니셜 (이름의 첫 글자)
    const initial = comment.name ? comment.name.charAt(0).toUpperCase() : '?';
    
    // 날짜 포맷팅
    const date = new Date(comment.created_at);
    const formattedDate = this.formatDate(date);

    // XSS 방지를 위해 textContent 사용
    const nameSpan = document.createElement('span');
    nameSpan.className = 'comment-username';
    nameSpan.textContent = comment.name;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'comment-content';
    contentDiv.textContent = comment.message;

    div.innerHTML = `
      <div class="comment-header">
        <div class="comment-author">
          <div class="comment-avatar">${this.sanitizeInput(initial)}</div>
          <div class="comment-info">
            <div class="comment-username"></div>
            <div class="comment-date">${formattedDate}</div>
          </div>
        </div>
        <div class="comment-actions">
          <button class="delete-btn" data-id="${comment.id}">삭제</button>
        </div>
      </div>
      <div class="comment-content"></div>
    `;

    // textContent로 안전하게 삽입
    div.querySelector('.comment-username').textContent = comment.name;
    div.querySelector('.comment-content').textContent = comment.message;

    // 삭제 버튼 이벤트
    const deleteBtn = div.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => this.deleteComment(comment.id));

    return div;
  }

  async deleteComment(commentId) {
    const password = prompt('댓글 작성 시 입력한 비밀번호를 입력하세요:');
    
    if (!password) return;

    if (password.length < 4) {
      this.showError('비밀번호는 4자 이상이어야 합니다.');
      return;
    }

    try {
      await this.api.deleteComment(commentId, password);
      await this.loadComments();
      this.showSuccess('댓글이 삭제되었습니다.');
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      this.showError('비밀번호가 일치하지 않거나 삭제에 실패했습니다.');
    }
  }

  updateCommentCount(count) {
    if (this.commentCount) {
      this.commentCount.textContent = `(${count})`;
    }
  }

  formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  }

  showError(message) {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.whiteSpace = 'pre-line';
    
    this.form.insertBefore(errorDiv, this.form.firstChild);

    setTimeout(() => {
      errorDiv.style.transition = 'opacity 0.3s';
      errorDiv.style.opacity = '0';
      setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
  }

  showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'error-message';
    successDiv.style.background = 'rgba(76, 175, 80, 0.1)';
    successDiv.style.borderColor = 'rgba(76, 175, 80, 0.3)';
    successDiv.style.color = '#4CAF50';
    successDiv.textContent = message;
    
    this.form.insertBefore(successDiv, this.form.firstChild);

    setTimeout(() => {
      successDiv.style.transition = 'opacity 0.3s';
      successDiv.style.opacity = '0';
      setTimeout(() => successDiv.remove(), 300);
    }, 3000);
  }
}
