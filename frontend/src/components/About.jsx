import React, { useEffect, useState } from 'react';
import '../styles/about.css';

const About = () => {
  const [displayText, setDisplayText] = useState('');
  const fullText = '기록하며';

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <section id="about" className="section fade-in">
      <div className="about-content">
        <div className="text-content">
          <h1>
            안녕하세요!
            <br />
            <span id="dynamic-text">{displayText}</span> 성장하는
            <br />
            <span id="profile-name">김규진</span>입니다.
          </h1>
          <div className="icons" aria-label="소셜 링크">
            <a href="https://kgyujin.tistory.com" target="_blank" rel="noopener noreferrer" aria-label="Tistory">
              <img src={`${import.meta.env.BASE_URL}img/logo-tistory.png`} alt="Tistory" />
            </a>
            <a href="https://github.com/kgyujin" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <img src={`${import.meta.env.BASE_URL}img/logo-github.png`} alt="GitHub" />
            </a>
            <a href="mailto:k_gyujin@daum.net" aria-label="Email">
              <img src={`${import.meta.env.BASE_URL}img/logo-email.png`} alt="Email" />
            </a>
          </div>
        </div>
        <img src={`${import.meta.env.BASE_URL}img/profile.png`} alt="프로필 사진" className="profile-img" />
      </div>
    </section>
  );
};

export default About;
