#!/usr/bin/env python3
"""
프로젝트 전체 파일 수 계산 스크립트
"""
import os
from pathlib import Path
from collections import defaultdict

def count_all_files(root_path):
    """모든 파일 수를 계산하고 시각화"""
    
    # 제외할 디렉토리
    exclude_dirs = {'.git', 'node_modules', '__pycache__', '.DS_Store', '.vscode'}
    
    file_count = 0
    dir_count = 0
    files_by_extension = defaultdict(int)
    files_by_directory = defaultdict(int)
    
    print("=" * 80)
    print("📊 프로젝트 파일 수 계산 중...")
    print("=" * 80)
    print()
    
    root = Path(root_path)
    
    for item in root.rglob('*'):
        # 제외할 디렉토리 체크
        if any(excluded in item.parts for excluded in exclude_dirs):
            continue
        
        if item.is_file():
            file_count += 1
            extension = item.suffix.lower() if item.suffix else '(확장자 없음)'
            files_by_extension[extension] += 1
            
            # 상대 경로의 첫 번째 디렉토리
            relative_path = item.relative_to(root)
            if len(relative_path.parts) > 1:
                first_dir = relative_path.parts[0]
            else:
                first_dir = '(루트)'
            files_by_directory[first_dir] += 1
            
            # 진행상황 표시
            if file_count % 10 == 0:
                print(f"✓ {file_count}개 파일 스캔 중... 현재: {item.name}", end='\r')
        
        elif item.is_dir():
            dir_count += 1
    
    print("\n")
    print("=" * 80)
    print("📈 결과 요약")
    print("=" * 80)
    print(f"\n총 파일 수: {file_count}개")
    print(f"총 디렉토리 수: {dir_count}개")
    
    # 디렉토리별 파일 수
    print("\n" + "=" * 80)
    print("📁 디렉토리별 파일 수")
    print("=" * 80)
    for directory, count in sorted(files_by_directory.items(), key=lambda x: x[1], reverse=True):
        bar = "█" * min(50, count)
        print(f"{directory:20s} │ {bar} {count:3d}개")
    
    # 확장자별 파일 수
    print("\n" + "=" * 80)
    print("📄 확장자별 파일 수")
    print("=" * 80)
    for ext, count in sorted(files_by_extension.items(), key=lambda x: x[1], reverse=True):
        bar = "█" * min(50, count)
        print(f"{ext:20s} │ {bar} {count:3d}개")
    
    print("\n" + "=" * 80)
    print("✅ 분석 완료!")
    print("=" * 80)
    
    return file_count, dir_count, files_by_extension, files_by_directory

if __name__ == "__main__":
    # 현재 디렉토리에서 실행
    project_root = os.path.dirname(os.path.abspath(__file__))
    count_all_files(project_root)
