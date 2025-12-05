import React from 'react';

const Header = () => {
  return (
    <div className="pagination" aria-label="페이지 네비게이션">
      <div className="dot active" data-index="0" role="button" aria-label="섹션 1"></div>
      <div className="dot" data-index="1" role="button" aria-label="섹션 2"></div>
      <div className="dot" data-index="2" role="button" aria-label="섹션 3"></div>
      <div className="dot" data-index="3" role="button" aria-label="섹션 4"></div>
      <div className="dot" data-index="4" role="button" aria-label="섹션 5"></div>
    </div>
  );
};

export default Header;
