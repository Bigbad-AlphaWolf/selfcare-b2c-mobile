 devsMail = 'mouhamadoubambambacke.sow@orange-sonatel.com, xx@orange-sonatel.com'

pipeline {

  agent {
    label 'mobile'
  }
  options {
        /* buildDiscarder(logRotator(numToKeepStr: '3')),*/
        timeout(time: 120, unit: 'MINUTES')
    }

  /*tools {
    nodejs 'nodejs-11.3.0'
    maven 'Maven_3.3.9'
  }*/



  stages {

    stage('Check Scm Changelog') {
        steps {
          script {
            def changeLogSets = currentBuild.changeSets
            for (int i = 0; i < changeLogSets.size(); i++) {
                def entries = changeLogSets[i].items
                for (int j = 0; j < entries.length; j++) {
                    def entry = entries[j]
                    if(entry.author.toString().contains('Jenkins') || entry.msg.contains('maven-release-plugin')){
                      echo "Les Commit effectués par le user jenkins sont toujours ignorés. C'est le cas des releases effectuées depuis la chaine d'integration avec le user jenkins"
                        currentBuild.result = 'ABORTED'
                        error('Aucun besoin de builder de façon cyclique les commits de Jenkins')
                        return
                    }else{
                      echo "ID Commit : ${entry.commitId} \nAuteur : ${entry.author} \nDate : ${new Date(entry.timestamp)} \nMessage: ${entry.msg}"
                      def files = new ArrayList(entry.affectedFiles)
                      for (int k = 0; k < files.size(); k++) {
                          def file = files[k]
                          echo "  ${file.editType.name} ${file.path}"
                      }
                    }
                }
            }
          }
        }
    }

    stage("Plugins install ionic") {
      steps{
        sh "npm install -g @ionic/cli"
        sh "yarn install"
      }
    }



    stage('Run unit test') {
      steps {
             sh 'npm run test'
      }
    }

    stage('SonarQube Scan') {
          steps {
            script {
              withSonarQubeEnv('SonarQubeServer') {
                 sh 'npm run sonar'
              }
            }
          }
     }

    stage("SonarQube Quality Gate") {
          steps {
            script {
              timeout(time: 10, unit: 'MINUTES') {
                sleep 10
                def qg = waitForQualityGate()
                if (qg.status != 'OK') {
                  error "Pipeline aborted due to quality gate failure: ${qg.status}"
                }
              }
            }
          }
        }

    stage("Build ionic project") {
      steps{
         sh "ionic build"
         sh "cp google-services.json www/"
      }
    }

    stage("Prepare build  android") {
      steps{
         sh "rm -rf android"
         sh "ionic capacitor add android"
         sh "ionic capacitor copy android"
      }
    }

    stage('Android Build Unsigned') {
      steps {
        echo "Build Android Unsigned"
        sh "cd android && ./gradlew assembleDebug"
      }
    }

    stage('Android Build Signed') {
      steps {
        echo "Build Android Signed"
        sh "cd android && ./gradlew assembleRelease && cd app/build/outputs/apk/release && jarsigner -keystore ../../../../../../ovto-key.keystore -storepass 'b:[S_#3R7?nLs*yJd^6<y' app-release-unsigned.apk ovto && mv app-release-unsigned.apk ovto.apk"
      }
      post{
        success {
          archiveArtifacts artifacts:  'android/app/build/outputs/apk/release/ovto.apk'
          emailext attachmentsPattern: 'android/app/build/outputs/apk/release/ovto.apk',
            body: 'Apk joint au mail.',
            subject: '[RELEASE] Signed',
            to: devsMail
        }
       }
    }


    stage("Remove node module") {
      steps{
        sh "rm -rf node_modules"
      }
    }

  }

  post {
   changed {
      emailext attachLog: true, body: '$DEFAULT_CONTENT', subject: '$DEFAULT_SUBJECT',  to: devsMail
   }
    failure {
      emailext attachLog: true, body: '$DEFAULT_CONTENT', subject: '$DEFAULT_SUBJECT',  to: devsMail
    }
  }



}
