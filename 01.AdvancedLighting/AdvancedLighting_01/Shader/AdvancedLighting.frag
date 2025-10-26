#version 460 core

layout (location = 0) in vec3 inFragPos;
layout (location = 1) in vec3 inNormal;
layout (location = 2) in vec2 inTexCoords;

layout (location = 0) out vec4 outColor;

layout (binding = 0) uniform sampler2D diffuseMap;

uniform vec3 lightPos;
uniform vec3 viewPos;
uniform bool blinn;

void main()
{
	vec3 color = texture(diffuseMap, inTexCoords).rgb;

	// ambient
	vec3 ambient = 0.05f * color;

	// diffuse
	vec3 lightDir = normalize(lightPos - inFragPos);
	vec3 normal = normalize(inNormal);
	float diff = max(dot(lightDir, normal), 0.0f);
	vec3 diffuse = diff * color;

	// specular
	vec3 viewDir = normalize(viewPos - inFragPos);
	vec3 reflectDir = reflect(-lightDir, normal);
	float spec = 0.0f;
	if (blinn)
	{
		vec3 halfwayDir = normalize(lightDir + viewDir);
		spec = pow(max(dot(normal, halfwayDir), 0.0f), 32.0f);
	}
	else
	{
		vec3 reflectDir = reflect(-lightDir, normal);
		spec = pow(max(dot(viewDir, reflectDir), 0.0f), 8.0f);
	}

	vec3 specular = vec3(0.3f) * spec;
	outColor = vec4(ambient + diffuse + specular, 1.0f);
}