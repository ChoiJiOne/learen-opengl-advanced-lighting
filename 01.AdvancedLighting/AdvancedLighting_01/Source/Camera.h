#pragma once

#include <glad/glad.h>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>

const float YAW = -90.0f;
const float PITCH = 0.0f;
const float SPEED = 2.5f;
const float SENSITIVITY = 0.1f;
const float ZOOM = 45.0f;

class Camera
{
public:
	enum EDirection
	{
		FORWARD,
		BACKWARD,
		LEFT,
		RIGHT
	};

	Camera(
		const glm::vec3& position = glm::vec3(0.0f, 0.0f, 0.0f),
		const glm::vec3& up = glm::vec3(0.0f, 1.0f, 0.0f),
		const float& yaw = YAW,
		const float& pitch = PITCH
	);

	glm::mat4 GetViewMatrix();
	const glm::vec3& GetPosition() { return _position; }
	const glm::vec3& GetFront() { return _front; }
	const float& GetZoom() { return _zoom; }
	
	void ProcessKeyboard(EDirection direction, float deltaTime);
	void ProcessMouseMovement(float xoffset, float yoffset, bool constrainPitch = true);
	void ProcessMouseScroll(float yoffset);

private:
	void UpdateCameraVectors();

private:
	glm::vec3 _position;
	glm::vec3 _front;
	glm::vec3 _up;
	glm::vec3 _right;
	glm::vec3 _worldUp;

	float _yaw = 0.0f;
	float _pitch = 0.0f;
	float _movementSpeed = 0.0f;
	float _mouseSensitivity = 0.0f;
	float _zoom = 0.0f;
};