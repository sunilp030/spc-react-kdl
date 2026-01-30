 const scanner = require('sonarqube-scanner').default;

scanner(
    {
        serverUrl: 'http://localhost:9000',
        token: "squ_2e6577b459661842082949bf5cdab11c3c6d5768",
        options: {
            'sonar.projectName': 'sonarqube-spc-kandivali',
            'sonar.projectDescription': 'Here I can add a description of my project',
            'sonar.projectKey': 'sonarqube-spc-kandivali',
            'sonar.projectVersion': '0.0.1',
            'sonar.exclusions': '',
            'sonar.sourceEncoding': 'UTF-8',
            'sonar.login':'squ_2e6577b459661842082949bf5cdab11c3c6d5768',
        }
    },
    error => {
        if (error) {
            console.error(error);
        }
        process.exit();
    },
)