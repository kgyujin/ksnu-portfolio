const mongoose = require('mongoose');
const crypto = require('crypto');

// 댓글 스키마 정의
const commentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '이름은 필수입니다'],
    trim: true,
    maxlength: [50, '이름은 50자 이내로 입력해주세요']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: null
  },
  message: {
    type: String,
    required: [true, '메시지는 필수입니다'],
    trim: true,
    maxlength: [500, '메시지는 500자 이내로 입력해주세요']
  },
  password: {
    type: String,
    required: [true, '비밀번호는 필수입니다'],
    minlength: [4, '비밀번호는 4자 이상이어야 합니다'],
    select: false // 조회 시 기본적으로 제외
  },
  ipAddress: {
    type: String,
    default: null
  },
  isApproved: {
    type: Boolean,
    default: true // 기본적으로 승인됨
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true, // createdAt, updatedAt 자동 생성
  collection: 'comments' // 컬렉션 이름 명시
});

// 비밀번호 해싱 미들웨어 (저장 전)
commentSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = crypto
      .createHash('sha256')
      .update(this.password)
      .digest('hex');
  }
  next();
});

// 비밀번호 검증 메서드
commentSchema.methods.verifyPassword = function(password) {
  const hashedPassword = crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');
  return this.password === hashedPassword;
};

// JSON 변환 시 민감한 정보 제외
commentSchema.methods.toJSON = function() {
  const comment = this.toObject();
  delete comment.password;
  delete comment.ipAddress;
  delete comment.__v;
  
  // MongoDB _id를 id로 변환 (프론트엔드 호환성)
  comment.id = comment._id;
  delete comment._id;
  
  // 날짜 필드명 변경 (MySQL 호환)
  comment.created_at = comment.createdAt;
  comment.updated_at = comment.updatedAt;
  delete comment.createdAt;
  delete comment.updatedAt;
  
  return comment;
};

// 인덱스 설정 (성능 최적화)
commentSchema.index({ createdAt: -1 }); // 최신순 정렬을 위한 인덱스
commentSchema.index({ isDeleted: 1, isApproved: 1 }); // 필터링을 위한 인덱스

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
