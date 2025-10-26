cmake_minimum_required(VERSION 3.30.3)

# 반드시 project 호출 전에 위치해야 함.
if(WIN32)
  set(VCPKG_PATH "$ENV{VCPKG_ROOT}")
  string(REPLACE "\\" "/" VCPKG_PATH "${VCPKG_PATH}")
  set(CMAKE_TOOLCHAIN_FILE "${VCPKG_PATH}/scripts/buildsystems/vcpkg.cmake")
else()
  # Windows가 아닌 경우(Linux, macOS 등)에는 경로를 그대로 사용.
  set(CMAKE_TOOLCHAIN_FILE "$ENV{VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake")
endif()

set(PROJECT_NAME "LearnOpenGL")
project(${PROJECT_NAME} LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})

find_package(glad CONFIG REQUIRED)
find_package(glfw3 CONFIG REQUIRED)
find_package(Stb REQUIRED)
find_package(glm CONFIG REQUIRED)

add_subdirectory(01.AdvancedLighting)