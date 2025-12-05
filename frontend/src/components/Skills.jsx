import React from 'react';
import '../styles/skills.css';

const Skills = () => {
  const skills = [
    'AndroidStudio-Light.svg',
    'C.svg',
    'CPP.svg',
    'CS.svg',
    'CSS.svg',
    'DotNet.svg',
    'Eclipse-Light.svg',
    'Figma-Light.svg',
    'Flask-Light.svg',
    'Gatsby.svg',
    'GCP-Light.svg',
    'Git.svg',
    'Github-Light.svg',
    'GithubActions-Light.svg',
    'GitLab-Light.svg',
    'Gradle-Light.svg',
    'HTML.svg',
    'Idea-Light.svg',
    'Illustrator.svg',
    'Java-Light.svg',
    'JavaScript.svg',
    'JQuery.svg',
    'Linux-Light.svg',
    'Markdown-Light.svg',
    'Maven-Light.svg',
    'MySQL-Light.svg',
    'Netlify-Light.svg',
    'PHP-Light.svg',
    'Postman.svg',
    'Python-Light.svg',
    'PyTorch-Light.svg',
    'React-Light.svg',
    'Spring-Light.svg',
    'SQLite.svg',
    'TensorFlow-Light.svg',
    'Unity-Light.svg',
    'Vercel-Dark.svg',
    'VIM-Light.svg',
    'VisualStudio-Light.svg',
    'VSCode-Light.svg',
    'Wordpress.svg',
    'XD.svg'
  ];

  return (
    <section id="skills" className="section fade-in">
      <h2 className="title">
        SKILLS
      </h2>
      <div className="skills-content">
        <ul id="skills-list">
          {skills.map((skill, index) => {
            const altText = skill.replace('-Light.svg', '').replace('-Dark.svg', '').replace('.svg', '');
            return (
              <li key={index}>
                <img src={`/ksnu-portfolio/img/skills/${skill}`} alt={altText} />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Skills;
