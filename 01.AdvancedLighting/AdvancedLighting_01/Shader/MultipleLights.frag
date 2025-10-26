#version 460 core

struct Material
{
	sampler2D diffuse;
	sampler2D specular;
	float shininess;
};

struct DirectionalLight
{
	vec3 direction;

	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
};

struct PointLight
{
	vec3 position;

	vec3 ambient;
	vec3 diffuse;
	vec3 specular;

	float constant;
	float linear;
	float quadratic;
};

struct SpotLight
{
	vec3 position;
	vec3 direction;

	vec3 ambient;
	vec3 diffuse;
	vec3 specular;

	float constant;
	float linear;
	float quadratic;

	float cutOff;
	float outerCutOff;
};

layout (location = 0) in vec3 inFragPos;
layout (location = 1) in vec3 inNormal;
layout (location = 2) in vec2 inTexCoords;

layout (location = 0) out vec4 outColor;

#define NR_POINT_LIGHTS 4

uniform vec3 viewPos;
uniform Material material;

uniform DirectionalLight directionalLight;
uniform PointLight pointLights[NR_POINT_LIGHTS];
uniform SpotLight spotLight;

vec3 CalculateDirectionalLight(DirectionalLight light, vec3 normal, vec3 viewDir);
vec3 CalculatePointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir);
vec3 CalculateSpotLight(SpotLight light, vec3 normal, vec3 fragPos, vec3 viewDir);

void main()
{
	vec3 norm = normalize(inNormal);
	vec3 viewDir = normalize(viewPos - inFragPos);

	vec3 result = CalculateDirectionalLight(directionalLight, norm, viewDir);
	for (int index = 0; index < NR_POINT_LIGHTS; ++index)
	{
		result += CalculatePointLight(pointLights[index], norm, inFragPos, viewDir);
	}
	result += CalculateSpotLight(spotLight, norm, inFragPos, viewDir);

	outColor = vec4(result, 1.0f);
}

vec3 CalculateDirectionalLight(DirectionalLight light, vec3 normal, vec3 viewDir)
{	
	// ambient
	vec3 ambient =  light.ambient * texture(material.diffuse, inTexCoords).rgb;
	
	// diffuse
	vec3 lightDir = normalize(-light.direction);
	float diff = max(dot(normal, lightDir), 0.0f);
	vec3 diffuse =  light.diffuse * (diff * texture(material.diffuse, inTexCoords).rgb);

	//specular
	vec3 reflectDir = reflect(-lightDir, normal);
	float spec = pow(max(dot(viewDir, reflectDir), 0.0f), material.shininess);
	vec3 specular = light.specular * (spec * texture(material.specular, inTexCoords).rgb);

	return (ambient + diffuse + specular);
}

vec3 CalculatePointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
{
	// ambient
	vec3 ambient =  light.ambient * texture(material.diffuse, inTexCoords).rgb;
	
	// diffuse
	vec3 lightDir = normalize(light.position - fragPos);
	float diff = max(dot(normal, lightDir), 0.0f);
	vec3 diffuse =  light.diffuse * (diff * texture(material.diffuse, inTexCoords).rgb);

	//specular
	vec3 reflectDir = reflect(-lightDir, normal);
	float spec = pow(max(dot(viewDir, reflectDir), 0.0f), material.shininess);
	vec3 specular = light.specular * (spec * texture(material.specular, inTexCoords).rgb);

	float dist = length(light.position - fragPos);
	float attenuation = 1.0f / (light.constant + light.linear * dist + light.quadratic * (dist * dist));

	ambient *= attenuation;
	diffuse *= attenuation;
	specular *= attenuation;

	return (ambient + diffuse + specular);
}

vec3 CalculateSpotLight(SpotLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
{
	// ambient
	vec3 ambient =  light.ambient * texture(material.diffuse, inTexCoords).rgb;

	// diffuse
	vec3 lightDir = normalize(light.position - fragPos);
	float diff = max(dot(normal, lightDir), 0.0f);
	vec3 diffuse =  light.diffuse * (diff * texture(material.diffuse, inTexCoords).rgb);

	//specular
	vec3 reflectDir = reflect(-lightDir, normal);
	float spec = pow(max(dot(viewDir, reflectDir), 0.0f), material.shininess);
	vec3 specular = light.specular * (spec * texture(material.specular, inTexCoords).rgb);

	float theta = dot(lightDir, normalize(-light.direction));
	float epsilon = (light.cutOff - light.outerCutOff);
	float intensity = clamp((theta - light.outerCutOff) / epsilon, 0.0f, 1.0f);
		
	float dist = length(light.position - fragPos);
	float attenuation = 1.0f / (light.constant + light.linear * dist + light.quadratic * (dist * dist));

	ambient *= attenuation * intensity;
	diffuse *= attenuation * intensity;
	specular *= attenuation * intensity;

	return (ambient + diffuse + specular);
}