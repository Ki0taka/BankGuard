const fs = require('fs');
const path = require('path');

const entities = [
  'role', 'user', 'requisition', 'sanctioned-entity', 
  'entity-name', 'entity-date-of-birth', 'entity-address', 'entity-status',
  'entity-profile', 'individual-profile', 'organization-profile', 'vessel-profile',
  'entity-bank-account', 'evidence-document', 'export-job', 'export-row',
  'external-source', 'sync-run', 'synced-entity', 'audit-log', 'aggregate-snapshot'
];

function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

function toPascalCase(str) {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

const srcDir = path.join(__dirname, 'src');

entities.forEach(name => {
  const dir = path.join(srcDir, name);
  const entitiesDir = path.join(dir, 'entities');
  const dtoDir = path.join(dir, 'dto');

  fs.mkdirSync(entitiesDir, { recursive: true });
  fs.mkdirSync(dtoDir, { recursive: true });

  const pascal = toPascalCase(name);
  const camel = toCamelCase(name);

  // Entities
  fs.writeFileSync(path.join(entitiesDir, `${name}.entity.ts`), `import { Entity, PrimaryGeneratedColumn } from 'typeorm';\n\n@Entity()\nexport class ${pascal} {\n  @PrimaryGeneratedColumn('uuid')\n  id: string;\n}\n`);

  // DTOs
  fs.writeFileSync(path.join(dtoDir, `create-${name}.dto.ts`), `export class Create${pascal}Dto {}\n`);
  fs.writeFileSync(path.join(dtoDir, `update-${name}.dto.ts`), `import { PartialType } from '@nestjs/mapped-types';\nimport { Create${pascal}Dto } from './create-${name}.dto';\n\nexport class Update${pascal}Dto extends PartialType(Create${pascal}Dto) {}\n`);

  // Repository
  fs.writeFileSync(path.join(dir, `${name}.repository.ts`), `import { Injectable } from '@nestjs/common';\nimport { DataSource, Repository } from 'typeorm';\nimport { ${pascal} } from './entities/${name}.entity';\n\n@Injectable()\nexport class ${pascal}Repository extends Repository<${pascal}> {\n  constructor(private dataSource: DataSource) {\n    super(${pascal}, dataSource.createEntityManager());\n  }\n}\n`);

  // Service
  fs.writeFileSync(path.join(dir, `${name}.service.ts`), `import { Injectable } from '@nestjs/common';\nimport { ${pascal}Repository } from './${name}.repository';\nimport { Create${pascal}Dto } from './dto/create-${name}.dto';\nimport { Update${pascal}Dto } from './dto/update-${name}.dto';\n\n@Injectable()\nexport class ${pascal}Service {\n  constructor(private readonly ${camel}Repository: ${pascal}Repository) {}\n\n  create(create${pascal}Dto: Create${pascal}Dto) {\n    return 'This action adds a new ${camel}';\n  }\n\n  findAll() {\n    return \`This action returns all ${camel}\`;\n  }\n\n  findOne(id: string) {\n    return \`This action returns a #${camel} id\`;\n  }\n\n  update(id: string, update${pascal}Dto: Update${pascal}Dto) {\n    return \`This action updates a #${camel} id\`;\n  }\n\n  remove(id: string) {\n    return \`This action removes a #${camel} id\`;\n  }\n}\n`);

  // Controller
  fs.writeFileSync(path.join(dir, `${name}.controller.ts`), `import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';\nimport { ${pascal}Service } from './${name}.service';\nimport { Create${pascal}Dto } from './dto/create-${name}.dto';\nimport { Update${pascal}Dto } from './dto/update-${name}.dto';\n\n@Controller('${name}')\nexport class ${pascal}Controller {\n  constructor(private readonly ${camel}Service: ${pascal}Service) {}\n\n  @Post()\n  create(@Body() create${pascal}Dto: Create${pascal}Dto) {\n    return this.${camel}Service.create(create${pascal}Dto);\n  }\n\n  @Get()\n  findAll() {\n    return this.${camel}Service.findAll();\n  }\n\n  @Get(':id')\n  findOne(@Param('id') id: string) {\n    return this.${camel}Service.findOne(id);\n  }\n\n  @Patch(':id')\n  update(@Param('id') id: string, @Body() update${pascal}Dto: Update${pascal}Dto) {\n    return this.${camel}Service.update(id, update${pascal}Dto);\n  }\n\n  @Delete(':id')\n  remove(@Param('id') id: string) {\n    return this.${camel}Service.remove(id);\n  }\n}\n`);

  // Module
  fs.writeFileSync(path.join(dir, `${name}.module.ts`), `import { Module } from '@nestjs/common';\nimport { TypeOrmModule } from '@nestjs/typeorm';\nimport { ${pascal}Service } from './${name}.service';\nimport { ${pascal}Controller } from './${name}.controller';\nimport { ${pascal}Repository } from './${name}.repository';\nimport { ${pascal} } from './entities/${name}.entity';\n\n@Module({\n  imports: [TypeOrmModule.forFeature([${pascal}])],\n  controllers: [${pascal}Controller],\n  providers: [${pascal}Service, ${pascal}Repository],\n  exports: [${pascal}Service, ${pascal}Repository],\n})\nexport class ${pascal}Module {}\n`);
});

console.log('Scaffolding complete!');
