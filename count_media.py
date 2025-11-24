#!/usr/bin/env python3
"""
프로젝트 미디어 파일 수 계산 스크립트
이미지, 영상 파일을 구분하여 계산
"""
import os
from pathlib import Path
from collections import defaultdict

def count_media_files(root_path):
    """미디어 파일 수를 계산하고 시각화"""
    
    # 미디어 파일 확장자 정의
    image_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.ico', '.webp'}
    video_extensions = {'.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'}
    
    # 제외할 디렉토리
    exclude_dirs = {'.git', 'node_modules', '__pycache__', '.DS_Store', '.vscode'}
    
    image_files = []
    video_files = []
    images_by_type = defaultdict(int)
    videos_by_type = defaultdict(int)
    media_by_directory = defaultdict(lambda: {'images': 0, 'videos': 0})
    
    print("=" * 80)
    print("🎬 프로젝트 미디어 파일 분석 중...")
    print("=" * 80)
    print()
    
    root = Path(root_path)
    
    for item in root.rglob('*'):
        # 제외할 디렉토리 체크
        if any(excluded in item.parts for excluded in exclude_dirs):
            continue
        
        if item.is_file():
            extension = item.suffix.lower()
            
            # 이미지 파일 체크
            if extension in image_extensions:
                image_files.append(item)
                images_by_type[extension] += 1
                
                # 디렉토리별 카운트
                relative_path = item.relative_to(root)
                if len(relative_path.parts) > 1:
                    first_dir = relative_path.parts[0]
                else:
                    first_dir = '(루트)'
                media_by_directory[first_dir]['images'] += 1
                
                print(f"🖼️  이미지 발견: {item.name}", end='\r')
            
            # 영상 파일 체크
            elif extension in video_extensions:
                video_files.append(item)
                videos_by_type[extension] += 1
                
                # 디렉토리별 카운트
                relative_path = item.relative_to(root)
                if len(relative_path.parts) > 1:
                    first_dir = relative_path.parts[0]
                else:
                    first_dir = '(루트)'
                media_by_directory[first_dir]['videos'] += 1
                
                print(f"🎥 영상 발견: {item.name}", end='\r')
    
    print("\n")
    
    # 결과 출력
    total_media = len(image_files) + len(video_files)
    
    print("=" * 80)
    print("📊 미디어 파일 분석 결과")
    print("=" * 80)
    print()
    print(f"🖼️  총 이미지 파일 수: {len(image_files)}개")
    print(f"🎥 총 영상 파일 수: {len(video_files)}개")
    print(f"📁 총 미디어 파일 수: {total_media}개")
    
    # 이미지 타입별
    if images_by_type:
        print("\n" + "=" * 80)
        print("🖼️  이미지 타입별 분포")
        print("=" * 80)
        max_count = max(images_by_type.values())
        for ext, count in sorted(images_by_type.items(), key=lambda x: x[1], reverse=True):
            percentage = (count / len(image_files)) * 100
            bar_length = int((count / max_count) * 40)
            bar = "█" * bar_length
            print(f"{ext:10s} │ {bar:<40s} │ {count:3d}개 ({percentage:5.1f}%)")
    
    # 영상 타입별
    if videos_by_type:
        print("\n" + "=" * 80)
        print("🎥 영상 타입별 분포")
        print("=" * 80)
        max_count = max(videos_by_type.values())
        for ext, count in sorted(videos_by_type.items(), key=lambda x: x[1], reverse=True):
            percentage = (count / len(video_files)) * 100
            bar_length = int((count / max_count) * 40)
            bar = "█" * bar_length
            print(f"{ext:10s} │ {bar:<40s} │ {count:3d}개 ({percentage:5.1f}%)")
    
    # 디렉토리별 미디어 파일
    if media_by_directory:
        print("\n" + "=" * 80)
        print("📁 디렉토리별 미디어 파일 분포")
        print("=" * 80)
        for directory, counts in sorted(media_by_directory.items(), 
                                       key=lambda x: x[1]['images'] + x[1]['videos'], 
                                       reverse=True):
            total = counts['images'] + counts['videos']
            img_bar = "🖼️ " * min(20, counts['images'])
            vid_bar = "🎥" * min(20, counts['videos'])
            print(f"{directory:20s} │ {img_bar}{vid_bar}")
            print(f"{'':20s} │ 이미지: {counts['images']:3d}개, 영상: {counts['videos']:3d}개, 합계: {total:3d}개")
            print()
    
    # 개별 파일 목록
    if image_files:
        print("=" * 80)
        print("🖼️  이미지 파일 목록")
        print("=" * 80)
        for img in sorted(image_files, key=lambda x: x.suffix):
            relative = img.relative_to(root)
            size_kb = img.stat().st_size / 1024
            print(f"  • {relative} ({size_kb:.1f} KB)")
    
    if video_files:
        print("\n" + "=" * 80)
        print("🎥 영상 파일 목록")
        print("=" * 80)
        for vid in sorted(video_files, key=lambda x: x.suffix):
            relative = vid.relative_to(root)
            size_mb = vid.stat().st_size / (1024 * 1024)
            print(f"  • {relative} ({size_mb:.1f} MB)")
    
    print("\n" + "=" * 80)
    print("✅ 미디어 파일 분석 완료!")
    print("=" * 80)
    
    return len(image_files), len(video_files), total_media

if __name__ == "__main__":
    # 현재 디렉토리에서 실행
    project_root = os.path.dirname(os.path.abspath(__file__))
    count_media_files(project_root)
