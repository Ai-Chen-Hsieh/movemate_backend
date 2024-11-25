import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'MoveMate',
    description: 'API Documentation',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './swagger-output.json'; // 生成的文件
const endpointsFiles = ['./src/index.ts']; // 主入口文件（包含路由）

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated!');
});
