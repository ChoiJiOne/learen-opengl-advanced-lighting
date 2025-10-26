cmake_minimum_required(VERSION 3.30.3)

add_subdirectory(GammaCorrection_01)

set_target_properties(
    GammaCorrection_01
    PROPERTIES FOLDER "02.GammaCorrection"
)