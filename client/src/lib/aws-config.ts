import { Amplify } from 'aws-amplify';

const awsconfig = {
  aws_project_region: 'us-east-1',
  aws_cognito_region: 'us-east-1',
  aws_user_pools_id: import.meta.env.VITE_AWS_USER_POOL_ID,
  aws_user_pools_web_client_id: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID,
  oauth: {},
  aws_cognito_username_attributes: ['email'],
  aws_cognito_social_providers: [],
  aws_cognito_signup_attributes: ['email'],
  aws_cognito_mfa_configuration: 'OFF',
  aws_cognito_mfa_types: [],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: []
  },
  aws_cognito_verification_mechanisms: ['email'],
  aws_user_files_s3_bucket: import.meta.env.VITE_AWS_S3_BUCKET,
  aws_user_files_s3_bucket_region: 'us-east-1',
  aws_cloud_logic_custom: [
    {
      name: 'trtr-api',
      endpoint: import.meta.env.VITE_API_GATEWAY_URL || 'https://si6gazv0cg.execute-api.us-east-1.amazonaws.com/prod',
      region: 'us-east-1'
    }
  ]
};

// Only configure Amplify if we have the required environment variables
if (import.meta.env.VITE_AWS_USER_POOL_ID || import.meta.env.VITE_API_GATEWAY_URL) {
  Amplify.configure(awsconfig);
}

export default awsconfig;