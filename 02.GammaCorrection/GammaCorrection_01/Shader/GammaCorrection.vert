#version 460 core

layout (location = 0) in vec3 inPosition;
layout (location = 1) in vec3 inNormal;
layout (location = 2) in vec2 inTexCoords;

layout (location = 0) out vec3 outFragPos;
layout (location = 1) out vec3 outNormal;
layout (location = 2) out vec2 outTexCoords;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main()
{
	outFragPos = vec3(model * vec4(inPosition, 1.0f));
	outNormal = mat3(transpose(inverse(model))) * inNormal;
	outTexCoords = inTexCoords;

	gl_Position = projection * view * vec4(outFragPos, 1.0f);
}