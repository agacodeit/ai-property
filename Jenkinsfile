pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        AWS_DEFAULT_REGION = 'us-east-1'
        AWS_ACCESS_KEY_ID = credentials('aiproperty-hml')
        AWS_SECRET_ACCESS_KEY = credentials('aiproperty-hml')
        S3_BUCKET = 'agacode-ai-property'
        BUILD_FOLDER = 'dist/ai-property'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build Angular') {
            steps {
                sh 'npm run build --configuration production'
            }
        }

        stage('Deploy to S3') {
            steps {
                sh '''
                    echo "🚀 Fazendo deploy para S3..."
                    aws s3 sync $BUILD_FOLDER/ s3://$S3_BUCKET --delete --region $AWS_REGION
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Deploy realizado com sucesso!'
        }
        failure {
            echo '❌ Ocorreu um erro no deploy.'
        }
    }
}