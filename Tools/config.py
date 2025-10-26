from dataclasses import dataclass,fields

@dataclass
class SolutionConfig:
    solution_path: str # 솔루션 경로
    log_file_path: str

@dataclass
class BuildConfig:
    solution_path: str # 솔루션 경로.
    config: str # 반드시 "Debug", "Release", "RelWithDebInfo", "MinSizeRel" 중 하나.
    log_file_path: str

def filter_dict_for_dataclass(cls, data):
    cls_field_names = {f.name for f in fields(cls)}
    return {k: v for k, v in data.items() if k in cls_field_names}