import 'dotenv/config';
import { PrismaClient, EntityType } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Prisma 7+ requires adapter for database connection
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  // Create sample project
  const project = await prisma.project.create({
    data: {
      title: 'Sample Mystery Novel',
      description: 'A detective story set in Victorian London',
      settings: {
        genre: 'mystery',
        setting: 'Victorian London',
        targetWordCount: 80000,
      },
    },
  });
  console.log('✅ Created project:', project.title);

  // Create entities
  const detective = await prisma.entity.create({
    data: {
      projectId: project.id,
      type: EntityType.CHARACTER,
      name: 'John Watson',
      description: 'A brilliant detective with a keen eye for detail',
      attributes: {
        age: 45,
        occupation: 'Private Detective',
        traits: ['observant', 'logical', 'persistent'],
        status: 'alive',
      },
    },
  });
  console.log('✅ Created character:', detective.name);

  const london = await prisma.entity.create({
    data: {
      projectId: project.id,
      type: EntityType.LOCATION,
      name: 'Baker Street Office',
      description: "The detective's office and residence",
      attributes: {
        locationType: 'building',
        address: '221B Baker Street, London',
        atmosphere: 'cluttered but cozy',
      },
    },
  });
  console.log('✅ Created location:', london.name);

  const pocketWatch = await prisma.entity.create({
    data: {
      projectId: project.id,
      type: EntityType.ITEM,
      name: 'Golden Pocket Watch',
      description: 'A mysterious pocket watch found at the crime scene',
      attributes: {
        itemType: 'evidence',
        rarity: 'rare',
        properties: ['engraved initials J.M.', 'stopped at 3:15'],
      },
    },
  });
  console.log('✅ Created item:', pocketWatch.name);

  // Create document
  const chapter1 = await prisma.document.create({
    data: {
      projectId: project.id,
      title: 'Chapter 1: The Mysterious Client',
      order: 1,
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Chapter 1: The Mysterious Client' }],
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'John Watson sat in his ' },
              {
                type: 'text',
                text: 'Baker Street Office',
                marks: [
                  {
                    type: 'entityMark',
                    attrs: {
                      entityId: london.id,
                      entityType: 'LOCATION',
                      entityName: 'Baker Street Office',
                    },
                  },
                ],
              },
              { type: 'text', text: ', examining the ' },
              {
                type: 'text',
                text: 'Golden Pocket Watch',
                marks: [
                  {
                    type: 'entityMark',
                    attrs: {
                      entityId: pocketWatch.id,
                      entityType: 'ITEM',
                      entityName: 'Golden Pocket Watch',
                    },
                  },
                ],
              },
              { type: 'text', text: ' that had been left on his doorstep that morning.' },
            ],
          },
        ],
      },
    },
  });
  console.log('✅ Created document:', chapter1.title);

  // Create scene
  const scene1 = await prisma.scene.create({
    data: {
      documentId: chapter1.id,
      title: 'The Discovery',
      summary: 'Watson discovers the mysterious pocket watch',
      order: 1,
      metadata: {
        mood: 'mysterious',
        timeOfDay: 'morning',
      },
    },
  });
  console.log('✅ Created scene:', scene1.title);

  // Link entities to scene
  await prisma.sceneEntity.createMany({
    data: [
      { sceneId: scene1.id, entityId: detective.id, role: 'protagonist' },
      { sceneId: scene1.id, entityId: london.id, role: 'setting' },
      { sceneId: scene1.id, entityId: pocketWatch.id, role: 'macguffin' },
    ],
  });
  console.log('✅ Linked entities to scene');

  console.log('\n🎉 Seed completed successfully!');
  console.log({
    project: project.id,
    entities: [detective.id, london.id, pocketWatch.id],
    document: chapter1.id,
    scene: scene1.id,
  });
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
