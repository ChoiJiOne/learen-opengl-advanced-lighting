#include "Camera.h"

Camera::Camera(const glm::vec3& position, const glm::vec3& up, const float& yaw, const float& pitch) 
	: _front(glm::vec3(0.0f, 0.0f, -1.0f)), _movementSpeed(SPEED), _mouseSensitivity(SENSITIVITY), _zoom(ZOOM)
{
	_position = position;
	_worldUp = up;
	_yaw = yaw;
	_pitch = pitch;
	UpdateCameraVectors();
}

glm::mat4 Camera::GetViewMatrix()
{
	return glm::lookAt(_position, _position + _front, _up);
}

void Camera::ProcessKeyboard(EDirection direction, float deltaTime)
{
	float velocity = _movementSpeed * deltaTime;

	if (direction == EDirection::FORWARD)
	{
		_position += _front * velocity;
	}

	if (direction == EDirection::BACKWARD)
	{
		_position -= _front * velocity;
	}

	if (direction == EDirection::LEFT)
	{
		_position -= _right * velocity;
	}

	if (direction == EDirection::RIGHT)
	{
		_position += _right * velocity;
	}
}

void Camera::ProcessMouseMovement(float xoffset, float yoffset, bool constrainPitch)
{
	xoffset *= _mouseSensitivity;
	yoffset *= _mouseSensitivity;

	_yaw += xoffset;
	_pitch += yoffset;

	if (constrainPitch)
	{
		_pitch = glm::clamp(_pitch, -89.0f, 89.0f);
	}

	UpdateCameraVectors();
}

void Camera::ProcessMouseScroll(float yoffset)
{
	_zoom -= yoffset;
	_zoom = glm::clamp(_zoom, 1.0f, 45.0f);
}

void Camera::UpdateCameraVectors()
{
	glm::vec3 front;
	front.x = cos(glm::radians(_yaw)) * cos(glm::radians(_pitch));
	front.y = sin(glm::radians(_pitch));
	front.z = sin(glm::radians(_yaw)) * cos(glm::radians(_pitch));

	_front = glm::normalize(front);
	_right = glm::normalize(glm::cross(_front, _worldUp));
	_up = glm::normalize(glm::cross(_right, _front));
}
