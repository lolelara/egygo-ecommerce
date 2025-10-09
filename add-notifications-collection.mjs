import { Client, Databases, ID, Permission, Role } from 'node-appwrite';

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('68d8b9db00134c41e7c8')
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = '68de037e003bd03c4d45';

async function createNotificationsCollection() {
  try {
    console.log('📝 Creating notifications collection...');

    // Create collection
    const collection = await databases.createCollection(
      DATABASE_ID,
      'notifications',
      'notifications',
      [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );

    console.log('✅ Collection created:', collection.$id);

    // Wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create attributes
    const attributes = [
      {
        key: 'userId',
        type: 'string',
        size: 255,
        required: true,
        description: 'User ID who receives the notification',
      },
      {
        key: 'title',
        type: 'string',
        size: 255,
        required: true,
        description: 'Notification title',
      },
      {
        key: 'message',
        type: 'string',
        size: 2000,
        required: true,
        description: 'Notification message',
      },
      {
        key: 'type',
        type: 'enum',
        elements: ['info', 'success', 'warning', 'error', 'account_approved', 'account_rejected'],
        required: true,
        description: 'Notification type',
      },
      {
        key: 'isRead',
        type: 'boolean',
        required: true,
        default: false,
        description: 'Whether notification has been read',
      },
      {
        key: 'link',
        type: 'string',
        size: 500,
        required: false,
        description: 'Optional link to navigate to',
      },
    ];

    for (const attr of attributes) {
      try {
        console.log(`📝 Creating attribute: ${attr.key}...`);

        if (attr.type === 'string') {
          await databases.createStringAttribute(
            DATABASE_ID,
            'notifications',
            attr.key,
            attr.size,
            attr.required,
            attr.default || null,
            false
          );
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(
            DATABASE_ID,
            'notifications',
            attr.key,
            attr.required,
            attr.default || false,
            false
          );
        } else if (attr.type === 'enum') {
          await databases.createEnumAttribute(
            DATABASE_ID,
            'notifications',
            attr.key,
            attr.elements,
            attr.required,
            attr.default || null,
            false
          );
        }

        console.log(`✅ Attribute ${attr.key} created successfully`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        if (error.code === 409) {
          console.log(`⚠️  Attribute ${attr.key} already exists, skipping...`);
        } else {
          console.error(`❌ Error creating attribute ${attr.key}:`, error.message);
        }
      }
    }

    console.log('\n🎉 Notifications collection setup complete!');

    // Create indexes
    console.log('\n📝 Creating indexes...');

    try {
      await databases.createIndex(
        DATABASE_ID,
        'notifications',
        'userId_index',
        'key',
        ['userId'],
        ['asc']
      );
      console.log('✅ userId index created');
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.log('⚠️  userId index may already exist');
    }

    try {
      await databases.createIndex(
        DATABASE_ID,
        'notifications',
        'isRead_index',
        'key',
        ['isRead'],
        ['asc']
      );
      console.log('✅ isRead index created');
    } catch (error) {
      console.log('⚠️  isRead index may already exist');
    }

    console.log('\n✅ Setup complete!');
  } catch (error) {
    if (error.code === 409) {
      console.log('⚠️  Collection already exists. Creating attributes only...');
      
      // Try to create attributes even if collection exists
      const attributes = [
        {
          key: 'userId',
          type: 'string',
          size: 255,
          required: true,
        },
        {
          key: 'title',
          type: 'string',
          size: 255,
          required: true,
        },
        {
          key: 'message',
          type: 'string',
          size: 2000,
          required: true,
        },
        {
          key: 'type',
          type: 'enum',
          elements: ['info', 'success', 'warning', 'error', 'account_approved', 'account_rejected'],
          required: true,
        },
        {
          key: 'isRead',
          type: 'boolean',
          required: true,
          default: false,
        },
        {
          key: 'link',
          type: 'string',
          size: 500,
          required: false,
        },
      ];

      for (const attr of attributes) {
        try {
          console.log(`📝 Creating attribute: ${attr.key}...`);

          if (attr.type === 'string') {
            await databases.createStringAttribute(
              DATABASE_ID,
              'notifications',
              attr.key,
              attr.size,
              attr.required,
              attr.default || null,
              false
            );
          } else if (attr.type === 'boolean') {
            await databases.createBooleanAttribute(
              DATABASE_ID,
              'notifications',
              attr.key,
              attr.required,
              attr.default || false,
              false
            );
          } else if (attr.type === 'enum') {
            await databases.createEnumAttribute(
              DATABASE_ID,
              'notifications',
              attr.key,
              attr.elements,
              attr.required,
              attr.default || null,
              false
            );
          }

          console.log(`✅ Attribute ${attr.key} created successfully`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          if (error.code === 409) {
            console.log(`⚠️  Attribute ${attr.key} already exists, skipping...`);
          } else {
            console.error(`❌ Error creating attribute ${attr.key}:`, error.message);
          }
        }
      }
    } else {
      console.error('❌ Error:', error);
    }
  }
}

createNotificationsCollection();
