import React from 'react';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>객체지향S/W 개발 프로젝트 - 김규진</p>
      <div className="footer-links">
        <a href="https://github.com/kgyujin/ksnu-webPortfolio" target="_blank" rel="noopener noreferrer" className="footer-link">
          GitHub
        </a>
        <a href="https://kgyujin.notion.site/ad8aa81a1bdb41e29951345f767723ad?pvs=4" target="_blank" rel="noopener noreferrer" className="footer-link">
          Notion
        </a>
      </div>
    </footer>
  );
};

export default Footer;
