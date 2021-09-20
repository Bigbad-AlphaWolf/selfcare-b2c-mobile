 devsMail = 'Team.selfcare-b2c@orange-sonatel.com'

pipeline {
  // agent any
  agent {
    label 'mobile'
  }
  options {
        /* buildDiscarder(logRotator(numToKeepStr: '3')),*/
        timeout(time: 120, unit: 'MINUTES')
    }

  tools {
    // maven 'Maven_3.3.9'
    // nodejs 'NodeJs'
    nodejs 'nodejs-11.3.0'
    gradle 'Gradle_6.5'
  }



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
    
   
 

    stage("Clean install") {
      steps{
        sh "npm run clean:all:install" 
      }
    }



    stage('Run unit test') {
      steps {
        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
          sh 'npm run test:ci'
        } 
      }
    }

    stage('SonarQube Scan') {
      steps {
        sh 'npm run sonar'
      }
    }

     /*stage("SonarQube Quality Gate") {
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
        } */

     stage("Create www && cp google-services") {
      steps{
         sh "mkdir -p www/"
         sh "cp google-services.json www/"
      }
    } 

    stage("Prepare build  android") {
      steps{
         sh "rm -rf platforms"
         sh "ionic cordova platform add android"
         sh "ionic cordova prepare android"
      }
    } 

    stage('Android Build Unsigned') {
      steps {
        echo "Build Android Unsigned"
        sh "npm run build:android:release"
      }
    } 


    stage('Android Build Signed') {
      steps {
        echo "Build Android Signed"
        sh "cd platforms/android/app/build/outputs/apk/release && jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ./my-release-key.jks -storepass 'azerty' platforms/android/app/build/outputs/apk/release/app-release.apk my-alias && mv app-release-unsigned.apk app-release-oem-signed.apk"
      }
      post{
        success {
          archiveArtifacts artifacts:  'platforms/android/app/build/outputs/apk/release/app-release-oem-signed.apk'
          emailext attachmentsPattern: 'platforms/android/app/build/outputs/apk/release/app-release-oem-signed.apk',
            body: 'Apk joint au mail.',
            subject: '[RELEASE] O&M ANDROID APK Signed',
            to: devsMail
        }
       }
    }
    
        stage('Execute mobile TAs') {    
          when { anyOf { branch 'master' } }

          steps {
            build job: 'CI_CD_OrangeEtMoi', parameters: [stringParam(name: 'Tag', value: 'CICD')]
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
