export class ProjectManager {
  constructor(apiClient) {
    this.api = apiClient;
    this.modal = document.getElementById('project-modal');
    this.closeButton = document.querySelector('.close-button');
    this.projectDetail = document.getElementById('project-detail');
    this.projects = {};
  }

  async init() {
    await this.loadProjects();
    this.setupEventListeners();
  }

  async loadProjects() {
    try {
      const projectsData = await this.api.getProjects();
      this.projects = projectsData.reduce((acc, project) => {
        acc[`project${project.id}`] = project;
        return acc;
      }, {});
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  }

  setupEventListeners() {
    document.querySelectorAll('.project').forEach(projectElement => {
      projectElement.addEventListener('click', () => {
        const projectKey = projectElement.getAttribute('data-project');
        const project = this.projects[projectKey];
        if (project) {
          this.openModal(project);
        }
      });
    });

    this.closeButton.addEventListener('click', () => {
      this.closeModal();
    });

    window.addEventListener('click', (event) => {
      if (event.target === this.modal) {
        this.closeModal();
      }
    });
  }

  openModal(project) {
    let issuesHtml = '';
    if (project.issues) {
      const issues = typeof project.issues === 'string' 
        ? JSON.parse(project.issues) 
        : project.issues;
      issuesHtml = `
        <h3>이슈</h3>
        <ul>
        ${issues.map(issue => `<li><strong>${issue.title}:</strong> ${issue.description}</li>`).join('')}
        </ul>
      `;
    }

    this.projectDetail.innerHTML = `
      <h2>${project.title}</h2>
      <h3>기간</h3>
      <p>${project.period}</p>
      <h3>소개</h3>
      <p>${project.description}</p>
      <h3>기술 스택</h3>
      <p>${project.skills}</p>
      <h3>역할</h3>
      <p>${project.role}</p>
      ${issuesHtml}
      <h3>리뷰</h3>
      <p>${project.review}</p>
      <h3>조회수</h3>
      <p>${project.view_count || 0}회</p>
    `;
    this.modal.style.display = 'block';
  }

  closeModal() {
    this.modal.style.display = 'none';
  }
}
