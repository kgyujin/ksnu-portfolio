import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

export const useTensorFlow = () => {
  const [model, setModel] = useState(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [interestScore, setInterestScore] = useState(0.1);
  const [projectInterests, setProjectInterests] = useState({});
  const [topProject, setTopProject] = useState(null);
  const behaviorData = useRef([]);
  const projectInteractions = useRef({});
  const lastUpdateTime = useRef(Date.now());

  useEffect(() => {
    initializeModel();
  }, []);

  useEffect(() => {
    if (!model || !isModelLoaded) return;
    
    const cleanup = startBehaviorTracking();
    return cleanup;
  }, [model, isModelLoaded]);

  const initializeModel = async () => {
    try {
      try {
        await tf.setBackend('cpu');
      } catch (e) {
        console.log('Backend skip');
      }
      
      console.log('TensorFlow.js init...');
      console.log('TensorFlow.js version:', tf.version.tfjs);

      const sequentialModel = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [9], units: 32, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 16, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.1 }),
          tf.layers.dense({ units: 8, activation: 'relu' }),
          tf.layers.dense({ units: 1, activation: 'sigmoid' })
        ]
      });

      sequentialModel.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
      });

      setModel(sequentialModel);
      setIsModelLoaded(true);
      console.log('Model loaded: 9-feature Neural Network (32-16-8-1)');
      sequentialModel.summary();
    } catch (error) {
      console.error('TensorFlow.js init failed:', error);
    }
  };

  const analyzeProjectInterest = (projectTitle, behaviorVector) => {
    if (!model || !isModelLoaded) return;

    try {
      const inputTensor = tf.tensor2d([behaviorVector]);
      const prediction = model.predict(inputTensor);
      
      prediction.data().then(data => {
        const score = data[0];
        
        inputTensor.dispose();
        prediction.dispose();

        setProjectInterests(prev => ({
          ...prev,
          [projectTitle]: score
        }));

        projectInteractions.current[projectTitle].score = score;
      });
    } catch (error) {
      console.error('Project interest analysis failed:', error);
    }
  };

  const analyzeBehavior = (behaviorVector) => {
    if (!model || !isModelLoaded) return;

    try {
      const inputTensor = tf.tensor2d([behaviorVector]);
      const prediction = model.predict(inputTensor);
      
      prediction.data().then(data => {
        const rawScore = data[0];
        
        const [scroll, click, time, hover, section, projects, analyses, deepScroll, hasClicks] = behaviorVector;
        
        let actualScore = 0;
        actualScore += scroll * 0.15;
        actualScore += click * 0.25;
        actualScore += time * 0.10;
        actualScore += hover * 0.15;
        actualScore += section * 0.20;
        actualScore += projects * 0.05;
        actualScore += deepScroll * 0.05;
        actualScore += hasClicks * 0.05;
        
        let finalScore = actualScore * 0.7 + rawScore * 0.3;
        
        const recentData = behaviorData.current[behaviorData.current.length - 1];
        if (recentData && recentData.idlePenalty < 1.0) {
          finalScore = finalScore * recentData.idlePenalty;
        }

        inputTensor.dispose();
        prediction.dispose();

        setInterestScore(finalScore);
        
        const now = Date.now();
        const timeDiff = (now - lastUpdateTime.current) / 1000;
        lastUpdateTime.current = now;
        
        console.log('Interest: ' + (finalScore * 100).toFixed(1) + '% (changed: ' + timeDiff.toFixed(1) + 's ago)');
        console.log('  Scroll: ' + (scroll * 100).toFixed(0) + '% | Click: ' + (click * 100).toFixed(0) + '% | Hover: ' + (hover * 100).toFixed(0) + '% | Section: ' + (section * 100).toFixed(0) + '%');

        const interests = Object.entries(projectInteractions.current);
        if (interests.length > 0) {
          const top = interests.reduce((max, curr) => 
            curr[1].score > max[1].score ? curr : max
          );
          setTopProject(top[0]);
          console.log('Top project: ' + top[0] + ' (' + (top[1].score * 100).toFixed(1) + '%)');
        }

        if (finalScore > 0.7) {
          console.log('HIGH interest - Strong hiring intent');
        } else if (finalScore > 0.4) {
          console.log('MEDIUM interest - Continuous exploration');
        } else {
          console.log('LOW interest - More interaction needed');
        }
      });
    } catch (error) {
      console.error('Behavior analysis failed:', error);
    }
  };

  const startBehaviorTracking = () => {
    let scrollDepth = 0;
    let clickCount = 0;
    let hoverCount = 0;
    let projectSectionTime = 0;
    let commentSectionTime = 0;
    const startTime = Date.now();
    const sectionStartTimes = {};
    const projectViewTime = {};
    let lastActivityTime = Date.now();
    let lastScrollPosition = 0;
    let isIdle = false;

    const updateSectionTime = () => {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        const rect = projectsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          if (!sectionStartTimes.projects) {
            sectionStartTimes.projects = Date.now();
          }
          projectSectionTime = (Date.now() - sectionStartTimes.projects) / 1000;
        }
      }

      const commentsSection = document.getElementById('comments');
      if (commentsSection) {
        const rect = commentsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          if (!sectionStartTimes.comments) {
            sectionStartTimes.comments = Date.now();
          }
          commentSectionTime = (Date.now() - sectionStartTimes.comments) / 1000;
        }
      }
    };

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      if (Math.abs(scrollTop - lastScrollPosition) > 50) {
        lastActivityTime = Date.now();
        lastScrollPosition = scrollTop;
        if (isIdle) {
          isIdle = false;
          console.log('Activity resumed');
        }
      }
      
      scrollDepth = Math.min((scrollTop + windowHeight) / documentHeight, 1);
      updateSectionTime();
    };

    const handleClick = (e) => {
      const oldCount = clickCount;
      clickCount++;
      lastActivityTime = Date.now();
      
      if (isIdle) {
        isIdle = false;
        console.log('Activity resumed');
      }
      
      const commentButton = e.target.closest('button[type="submit"], .delete-btn');
      if (commentButton) {
        clickCount += 3;
        console.log('Comment interaction detected -> Interest UP UP UP');
      }
      
      const commentInput = e.target.closest('.comment-form input, .comment-form textarea');
      if (commentInput) {
        clickCount += 2;
        console.log('Comment input started -> Interest UP UP');
      }
      
      const projectElement = e.target.closest('.project');
      if (projectElement) {
        const projectTitle = projectElement.querySelector('h3')?.textContent || 'Unknown';
        if (!projectInteractions.current[projectTitle]) {
          projectInteractions.current[projectTitle] = {
            clicks: 0,
            hovers: 0,
            viewTime: 0,
            score: 0
          };
        }
        projectInteractions.current[projectTitle].clicks++;
        clickCount += 1;
        console.log('Project clicked: ' + projectTitle + ' -> Interest UP');
      }
      
      const linkElement = e.target.closest('a');
      if (linkElement && linkElement.href) {
        clickCount += 2;
        console.log('Link clicked -> Interest UP UP');
      }
      
      if (clickCount > oldCount + 1) {
        console.log('Click count: ' + oldCount + ' -> ' + clickCount + ' (increase: +' + (clickCount - oldCount) + ')');
      }
    };

    const handleMouseOver = (e) => {
      lastActivityTime = Date.now();
      
      const commentSection = e.target.closest('#comments, .comment-form, .comment-item');
      if (commentSection && !commentSection.dataset.hovered) {
        commentSection.dataset.hovered = 'true';
        hoverCount += 2;
        console.log('Comment section hovered -> Interest UP');
      }
      
      const projectElement = e.target.closest('.project');
      if (projectElement) {
        const projectTitle = projectElement.querySelector('h3')?.textContent || 'Unknown';
        if (!projectInteractions.current[projectTitle]) {
          projectInteractions.current[projectTitle] = {
            clicks: 0,
            hovers: 0,
            viewTime: 0,
            score: 0
          };
        }
        projectInteractions.current[projectTitle].hovers++;
        hoverCount++;
        
        if (!projectViewTime[projectTitle]) {
          projectViewTime[projectTitle] = Date.now();
          console.log('Project hover started: ' + projectTitle);
        }
      }
    };

    const handleMouseOut = (e) => {
      const projectElement = e.target.closest('.project');
      if (projectElement) {
        const projectTitle = projectElement.querySelector('h3')?.textContent || 'Unknown';
        if (projectViewTime[projectTitle]) {
          const viewDuration = (Date.now() - projectViewTime[projectTitle]) / 1000;
          if (projectInteractions.current[projectTitle]) {
            projectInteractions.current[projectTitle].viewTime += viewDuration;
          }
          delete projectViewTime[projectTitle];
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClick);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    const interval = setInterval(() => {
      updateSectionTime();
      const timeSpent = (Date.now() - startTime) / 1000;
      const idleTime = (Date.now() - lastActivityTime) / 1000;
      
      let idlePenalty = 1.0;
      if (idleTime > 10) {
        if (!isIdle) {
          isIdle = true;
          console.log('WARNING: Idle state detected (10+ seconds) -> Interest DOWN');
        }
        idlePenalty = Math.max(0.3, 1.0 - ((idleTime - 10) * 0.05));
        const penaltyPercent = ((1 - idlePenalty) * 100).toFixed(0);
        console.log('IDLE ' + idleTime.toFixed(0) + 's | Penalty: ' + penaltyPercent + '% decrease');
      }
      
      let scrollPenalty = 1.0;
      if (idleTime > 15 && scrollDepth < 0.3) {
        scrollPenalty = 0.7;
        console.log('Long stay at top area -> Additional interest DOWN');
      }
      
      const behaviorVector = [
        scrollDepth,
        Math.min(clickCount / 8, 1) * idlePenalty,
        Math.min(timeSpent / 120, 1),
        Math.min(hoverCount / 5, 1) * idlePenalty,
        Math.min((projectSectionTime + commentSectionTime) / 40, 1) * scrollPenalty,
        Math.min(Object.keys(projectInteractions.current).length / 6, 1),
        Math.min(behaviorData.current.length / 20, 1),
        scrollDepth > 0.5 ? 1 : 0,
        Object.values(projectInteractions.current).reduce((sum, p) => sum + p.clicks, 0) > 0 ? 1 : 0
      ];

      behaviorData.current.push({
        timestamp: Date.now(),
        vector: behaviorVector,
        idleTime: idleTime,
        idlePenalty: idlePenalty
      });

      console.log('-------------------------------------');
      console.log('Time: ' + timeSpent.toFixed(0) + 's | Idle: ' + idleTime.toFixed(0) + 's | Analysis #' + behaviorData.current.length);

      analyzeBehavior(behaviorVector);
      
      Object.entries(projectInteractions.current).forEach(([projectTitle, data]) => {
        const projectVector = [
          Math.min(data.clicks / 3, 1),
          Math.min(data.hovers / 2, 1),
          Math.min(data.viewTime / 20, 1),
          scrollDepth,
          Math.min(timeSpent / 120, 1),
          data.clicks > 0 ? 1 : 0,
          data.hovers > 1 ? 1 : 0,
          data.viewTime > 3 ? 1 : 0,
          Math.min(projectSectionTime / 40, 1)
        ];
        
        analyzeProjectInterest(projectTitle, projectVector);
      });
    }, 2000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      clearInterval(interval);
    };
  };

  const getMemoryInfo = () => {
    return tf.memory();
  };

  return {
    isModelLoaded,
    interestScore,
    projectInterests,
    topProject,
    getMemoryInfo
  };
};
