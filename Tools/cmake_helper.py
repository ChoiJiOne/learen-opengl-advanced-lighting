import subprocess
import os

from config import SolutionConfig, BuildConfig, filter_dict_for_dataclass
from logger import init_logger

class CMakeHelper:
    def __init__(self, config_cls, **kwargs):
        self.cmake_config = config_cls(**filter_dict_for_dataclass(config_cls, kwargs))
        self.logger = init_logger(self.cmake_config.log_file_path)

    def get_logger(self):
        return self.logger
    
    def run_generate(self):
        command = [
            "cmake", "..",
            "-G", "Visual Studio 17 2022",
            "-A", "x64"
        ]

        self.logger.info("솔루션 생성 시작")
        self.logger.info(f"Command: {' '.join(command)}")

        abs_solution_path = os.path.abspath(self.cmake_config.solution_path)
        if not os.path.isdir(abs_solution_path):
            os.makedirs(abs_solution_path)
        
        process = subprocess.Popen(
            command, 
            cwd=os.path.abspath(self.cmake_config.solution_path),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            bufsize=0, 
            encoding="utf-8", 
            errors="replace"
        )

        for build_log_line in map(str.strip, process.stdout):
            self.logger.info(build_log_line)
        process.wait()

        if process.returncode == 0:
            self.logger.info(f"솔루션 생성 성공")
        else:
            raise subprocess.SubprocessError(f"솔루션 생성 실패: {process.stderr}")
    
    def run_build(self):
        command = [
            "cmake",
            "--build", self.cmake_config.solution_path,
            "--config", self.cmake_config.config
        ]

        self.logger.info("솔루션 빌드 시작")
        self.logger.info(f"Command: {' '.join(command)}")

        process = subprocess.Popen(
            command, 
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            bufsize=0, 
            encoding="utf-8", 
            errors="replace"
        )

        for build_log_line in map(str.strip, process.stdout):
            self.logger.info(build_log_line)
        process.wait()

        if process.returncode == 0:
            self.logger.info(f"솔루션 빌드 성공")
        else:
            raise subprocess.SubprocessError(f"솔루션 빌드 실패: {process.stderr}")