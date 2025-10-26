#version 460 core

layout (location = 0) in vec3 inFragPos;
layout (location = 1) in vec3 inNormal;
layout (location = 2) in vec2 inTexCoords;

layout (location = 0) out vec4 outColor;

layout (binding = 0) uniform sampler2D diffuseMap;

uniform vec3 lightPositions[4];
uniform vec3 lightColors[4];
uniform vec3 viewPos;
uniform bool gamma;

vec3 BlinnPhong(vec3 normal, vec3 fragPos, vec3 lightPos, vec3 lightColor)
{
	vec3 lightDir = normalize(lightPos - fragPos);

	// diffuse
	float diff = max(dot(lightDir, normal), 0.0f);
	vec3 diffuse = diff * lightColor;

	// specular
	vec3 viewDir = normalize(viewPos - inFragPos);
	vec3 halfwayDir = normalize(lightDir + viewDir);
	float spec = pow(max(dot(normal, halfwayDir), 0.0f), 32.0f);
	vec3 specular = spec * lightColor;

	float maxDistance = 1.5f;
	float dist = length(lightPos - fragPos);
	float attenuation = 1.0f / (gamma ? dist * dist : dist);

	diffuse *= attenuation;
	specular *= attenuation;

	return diffuse + specular;
}

void main()
{
	vec3 color = texture(diffuseMap, inTexCoords).rgb;
	vec3 lighting = vec3(0.0f);

	for (int index = 0; index < 4; ++index)
	{
		lighting += BlinnPhong(normalize(inNormal), inFragPos, lightPositions[index], lightColors[index]);
	}

	color *= lighting;
	if (gamma)
	{
		color = pow(color, vec3(1.0f / 2.2f));
	}

	outColor = vec4(color, 1.0f);
}