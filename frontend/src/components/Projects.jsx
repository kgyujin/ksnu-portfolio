import React, { useState } from 'react';
import '../styles/projects.css';

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 'project1',
      title: '국립생태원',
      description: '연구원들이 공지사항 및 자료를 관리하고 데이터를 효율적으로 분류 및 조회할 수 있게 지원하는 데이터 관리 웹 사이트',
      period: '2022년 11월 28일 → 2023년 11월 10일',
      skills: 'Spring, MySQL, Tomcat',
      image: '/ksnu-portfolio/img/projects/project1.png'
    },
    {
      id: 'project2',
      title: '대구어린이세상',
      description: '어린이와 가족들이 다양한 교육 콘텐츠와 서비스를 이용할 수 있는 웹 사이트',
      period: '2023년 3월 31일 → 2023년 7월 26일',
      skills: 'eGov, Oracle Database, Tomcat',
      image: '/ksnu-portfolio/img/projects/project2.png'
    },
    {
      id: 'project3',
      title: '도서 관리 프로그램',
      description: '사용자가 손쉽게 도서와 회원을 관리할 수 있도록 C#으로 개발된 도서 관리 프로그램',
      period: '2022년 5월 16일 → 2022년 6월 29일',
      skills: 'C#(WPF .NET), MySQL',
      image: '/ksnu-portfolio/img/projects/project3.png'
    },
    {
      id: 'project4',
      title: '이무아',
      description: '인공지능을 활용한 사물 인식 모바일 앱',
      period: '2022년 3월 24일 → 2022년 6월 24일',
      skills: 'Android Studio, Java, TensorFlow',
      image: '/ksnu-portfolio/img/projects/project4.png'
    },
    {
      id: 'project5',
      title: 'TIL',
      description: '일일 학습 내용을 정리하고 Contributions에 기록을 남기며 개발 의지를 고취시킨 웹 사이드 프로젝트',
      period: '2022년 7월 11일 → 2022년 8월 17일',
      skills: 'Node.js, Docsify, Markdown',
      image: '/ksnu-portfolio/img/projects/project5.png'
    },
    {
      id: 'project6',
      title: 'CI3 학습 노트',
      description: '학습 내용을 체계적으로 되돌아볼 수 있는 웹 기반 학습 노트',
      period: '2022년 4월 28일 → 2022년 6월 23일',
      skills: 'PHP, CodeIgniter, XAMPP, MySQL',
      image: '/ksnu-portfolio/img/projects/project6.png'
    }
  ];

  const openModal = (project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <>
      <section id="projects" className="section slide-up">
        <h2 className="title">
          PROJECTS
        </h2>
        <div className="project-gallery">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="project" 
              data-project={project.id}
              style={{ backgroundImage: `url('${project.image}')` }}
              onClick={() => openModal(project)}
            >
              <div className="project-content">
                <h3>{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-meta">
                  <span className="project-period">{project.period}</span>
                  <span className="project-skills">{project.skills}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedProject && (
        <div id="project-modal" className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={closeModal}>×</span>
            <div id="project-detail">
              <h2>{selectedProject.title}</h2>
              <p>{selectedProject.description}</p>
              <div className="project-meta">
                <p><strong>기간:</strong> {selectedProject.period}</p>
                <p><strong>기술 스택:</strong> {selectedProject.skills}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;
