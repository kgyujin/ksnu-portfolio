// HTML 컴포넌트 로더
export class ComponentLoader {
    static async loadComponent(componentName) {
        try {
            const response = await fetch(`components/${componentName}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load ${componentName}`);
            }
            return await response.text();
        } catch (error) {
            console.error(`Error loading ${componentName}:`, error);
            return '';
        }
    }

    static async loadAllComponents() {
        const mainContainer = document.getElementById('main-container');
        
        if (!mainContainer) {
            console.error('Main container not found');
            return;
        }

        // 로드할 컴포넌트 순서
        const components = [
            'about',
            'timeline',
            'introduce',
            'skills',
            'projects',
            'comments'
        ];

        // 모든 컴포넌트를 순차적으로 로드
        for (const component of components) {
            const html = await this.loadComponent(component);
            if (html) {
                mainContainer.insertAdjacentHTML('beforeend', html);
            }
        }

        // header와 footer는 별도 처리
        await this.loadHeader();
        await this.loadFooter();
    }

    static async loadHeader() {
        const body = document.body;
        const html = await this.loadComponent('header');
        if (html) {
            body.insertAdjacentHTML('afterbegin', html);
        }
    }

    static async loadFooter() {
        const body = document.body;
        const html = await this.loadComponent('footer');
        if (html) {
            body.insertAdjacentHTML('beforeend', html);
        }
    }
}

// 페이지 로드 시 컴포넌트 로드
document.addEventListener('DOMContentLoaded', async () => {
    await ComponentLoader.loadAllComponents();
    
    // 컴포넌트 로드 완료 이벤트 발생
    window.dispatchEvent(new Event('componentsLoaded'));
});
