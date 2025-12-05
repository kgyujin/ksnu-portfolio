import React, { useState, useEffect } from 'react';
import { commentAPI } from '../services/api';
import '../styles/comments.css';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    message: ''
  });
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const data = await commentAPI.getAll();
      setComments(data);
    } catch (error) {
      console.warn('댓글 로드 실패 (서버 연결 불가):', error.message);
      setComments([]);
    }
  };

  const handleContentChange = (e) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setFormData({ ...formData, message: value });
      setCharCount(value.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await commentAPI.create(formData);
      setFormData({ name: '', password: '', message: '' });
      setCharCount(0);
      loadComments();
      alert('댓글이 작성되었습니다!');
    } catch (error) {
      alert('댓글 저장 실패: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    const password = prompt('비밀번호를 입력하세요:');
    if (!password) return;

    try {
      await commentAPI.delete(id, password);
      alert('댓글이 삭제되었습니다.');
      loadComments();
    } catch (error) {
      const errorMessage = error.message.includes('401') 
        ? '비밀번호가 일치하지 않습니다.' 
        : '댓글 삭제 실패: ' + error.message;
      alert(errorMessage);
    }
  };

  return (
    <section id="comments" className="section fade-in">
      <h2 className="title">
        COMMENTS
      </h2>
      <div className="comments-container">
        {/* 댓글 작성 폼 */}
        <div className="comment-form-wrapper">
          <h3>댓글 남기기</h3>
          <form id="comment-form" className="comment-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="comment-username">이름 <span className="required">*</span></label>
                <input 
                  type="text" 
                  id="comment-username" 
                  name="username" 
                  required 
                  maxLength="50" 
                  placeholder="이름을 입력하세요"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="comment-password">비밀번호 <span className="required">*</span></label>
                <input 
                  type="password" 
                  id="comment-password" 
                  name="password" 
                  required 
                  minLength="4" 
                  maxLength="20" 
                  placeholder="4자 이상 입력"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <small>댓글 삭제 시 사용됩니다</small>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="comment-content">댓글 내용 <span className="required">*</span></label>
              <textarea 
                id="comment-content" 
                name="content" 
                required 
                maxLength="500" 
                rows="5" 
                placeholder="댓글을 입력하세요 (최대 500자)"
                value={formData.message}
                onChange={handleContentChange}
              />
              <div className="char-count">
                <span id="char-current">{charCount}</span> / 500
              </div>
            </div>
            <button type="submit" className="submit-btn">댓글 작성</button>
          </form>
        </div>

        {/* 댓글 목록 */}
        <div className="comments-list-wrapper">
          <h3>댓글 목록 <span id="comment-count" className="comment-count">({comments.length})</span></h3>
          <div id="comments-list" className="comments-list">
            {comments.length === 0 ? (
              <div className="no-comments">
                아직 댓글이 없습니다.<br />첫 댓글을 남겨보세요!
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-writer">{comment.name}</span>
                    <span className="comment-date">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="comment-content">{comment.message}</div>
                  <div className="comment-actions">
                    <button onClick={() => handleDelete(comment.id)}>삭제</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comments;
