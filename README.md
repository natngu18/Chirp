## Starting Backend Services

You have two options for Firebase: using the Firebase emulator or the actual Firebase service.

### Using the Firebase Emulator

Follow the steps in the [Starting the Firebase Authentication Emulator](#starting-the-firebase-authentication-emulator) section.

### Using the Actual Firebase Service

For setting up and using the actual Firebase service, refer to the [Setting up the Actual Firebase Service](#setting-up-the-actual-firebase-service) section.

### Common Steps

1. Setup Firebase service
1. Migrate the database (`backend\Chirp\src\Chirp.Infrastructure`):

    ```shell
    update-database
    ```

1. Run Docker Compose to start the necessary services (`backend/`):

    ```shell
    docker-compose up -d
    ```

1. Wait for infrastructure to be up and running

1. Register the Debezium PostgreSQL connectors for users and posts (`backend/`):

    ```shell
    curl -X POST --location "http://localhost:8083/connectors" -H "Content-Type: application/json" -H "Accept: application/json" -d @user-connector.json
    ```

    ```shell
    curl -X POST --location "http://localhost:8083/connectors" -H "Content-Type: application/json" -H "Accept: application/json" -d @post-connector.json
    ```

1. Run .NET project with appropriate launch profile (`backend\Chirp\src\Chirp.Presentation`):

    ```shell
    dotnet run --launch-profile "ProfileName"
    ```

## Starting Frontend Services

1. Install frontend dependencies (`frontend/`)

    ```shell
    npm i
    ```

2. Run project
    ```shell
    npm run dev
    ```


## Demos

https://github.com/natngu18/Chirp/assets/45031258/d9a7efe7-0916-4210-b613-2025e9c62950

https://github.com/natngu18/Chirp/assets/45031258/fafd6170-65d1-4244-8bd3-cf0b2fe28228

https://github.com/natngu18/Chirp/assets/45031258/6a69a5f0-a33b-4a76-b70a-2a32e85c9800

https://github.com/natngu18/Chirp/assets/45031258/3808a580-43fc-450b-9610-e912deca02c1

https://github.com/natngu18/Chirp/assets/45031258/f7f6ead6-41e4-4857-9f2a-3c8d3061a930


### Mobile demo

https://github.com/natngu18/Chirp/assets/45031258/3854e616-d4c2-40e5-93f8-b7c248fb3d3e

https://github.com/natngu18/Chirp/assets/45031258/56529554-adfd-4269-ad17-bd0308129c4d








### Starting the Firebase Authentication Emulator

To start the Firebase Authentication Emulator, follow these steps:

1.  Install Firebase CLI

    ```shell
    npm install -g firebase-tools
    ```

2.  Change the current working directory to the scripts folder:

    ```shell
    cd .github\workflows\scripts
    ```

3.  Modify settings according to your needs (`firebase.json`). If you make any changes to auth or storage, you must reflect them in either/both .env files:

    ```json
    {
        "emulators": {
            "hub": {
                "host": "0.0.0.0",
                "port": 4400
            },
            "storage": {
                "host": "0.0.0.0",
                "port": 9199
            },
            "logging": {
                "host": "0.0.0.0",
                "port": 4500
            },
            "singleProjectMode": true,
            "auth": {
                "port": 9099
            }
        },
        "storage": {
            "rules": "storage.rules"
        }
    }
    ```

4.  Start emulators:

    ```shell
    firebase emulators:start --only storage,auth --project "YourProjectName"
    ```

5.  Modify backend .env accordingly. Bucket name should be "YourProjectName".appspot.com:

    ```shell
    FIREBASE_BUCKETNAME=your-firebase-bucket-name
    SERVICE_ACCOUNT=your-firestore-service-account-json
    FIREBASE_DEV_AUTH_URL=127.0.0.1:9099
    FIREBASE_DEV_STORAGE_BASEURL=http://127.0.0.1:9199/v0/b/
    ```

6.  You must run React and .NET projects in development mode.

### Setting up the Actual Firebase Service

Make sure you have set up your Firebase project and downloaded the service account key. Set the environment variables accordingly.

The backend `.env` file should be at (`backend/Chirp/src/Chirp.Presentation/.env`).

```shell
JWT_FIREBASE_VALIDISSUER=your-firebase-valid-issuer
JWT_FIREBASE_VALIDAUDIENCE=your-firebase-valid-audience
FIREBASE_BUCKETNAME=your-firebase-bucket-name
FIREBASE_STORAGE_BASEURL=https://firebasestorage.googleapis.com/v0/b/
SERVICE_ACCOUNT=your-firestore-service-account-json
```

The .NET and React projects must not be run in Development if using actual Firebase service. Configure frontend `.env` (`frontend/.env`)

```shell
VITE_NODE_ENV=development
```

and .NET launch settings accordingly (`backend/Chirp/src/Chirp.Presentation/Properties/launchSettings.json`)



