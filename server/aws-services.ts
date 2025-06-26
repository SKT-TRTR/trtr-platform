import AWS from 'aws-sdk';

// Configure AWS services
const comprehend = new AWS.Comprehend({ region: process.env.AWS_REGION || 'us-east-1' });
const rekognition = new AWS.Rekognition({ region: process.env.AWS_REGION || 'us-east-1' });
const polly = new AWS.Polly({ region: process.env.AWS_REGION || 'us-east-1' });
const translate = new AWS.Translate({ region: process.env.AWS_REGION || 'us-east-1' });
const lambda = new AWS.Lambda({ region: process.env.AWS_REGION || 'us-east-1' });

// Sentiment Analysis using Amazon Comprehend (Free Tier: 50,000 units/month)
export async function detectSentimentAWS(text: string): Promise<any> {
  try {
    const params = {
      Text: text,
      LanguageCode: 'en'
    };
    
    const result = await comprehend.detectSentiment(params).promise();
    return {
      sentiment: result.Sentiment,
      confidence: result.SentimentScore,
      service: 'aws-comprehend'
    };
  } catch (error) {
    throw new Error(`AWS Comprehend error: ${error.message}`);
  }
}

// Entity Detection using Amazon Comprehend
export async function detectEntitiesAWS(text: string): Promise<any> {
  try {
    const params = {
      Text: text,
      LanguageCode: 'en'
    };
    
    const result = await comprehend.detectEntities(params).promise();
    return {
      entities: result.Entities,
      service: 'aws-comprehend'
    };
  } catch (error) {
    throw new Error(`AWS Comprehend error: ${error.message}`);
  }
}

// Image Analysis using Amazon Rekognition (Free Tier: 5,000 images/month)
export async function analyzeImageAWS(imageBase64: string): Promise<any> {
  try {
    const imageBytes = Buffer.from(imageBase64, 'base64');
    
    const params = {
      Image: {
        Bytes: imageBytes
      },
      MaxLabels: 10,
      MinConfidence: 70
    };
    
    const result = await rekognition.detectLabels(params).promise();
    return {
      labels: result.Labels,
      service: 'aws-rekognition'
    };
  } catch (error) {
    throw new Error(`AWS Rekognition error: ${error.message}`);
  }
}

// Face Detection using Amazon Rekognition
export async function detectFacesAWS(imageBase64: string): Promise<any> {
  try {
    const imageBytes = Buffer.from(imageBase64, 'base64');
    
    const params = {
      Image: {
        Bytes: imageBytes
      },
      Attributes: ['ALL']
    };
    
    const result = await rekognition.detectFaces(params).promise();
    return {
      faces: result.FaceDetails,
      service: 'aws-rekognition'
    };
  } catch (error) {
    throw new Error(`AWS Rekognition error: ${error.message}`);
  }
}

// Text-to-Speech using Amazon Polly (Free Tier: 5M characters/month)
export async function synthesizeSpeechAWS(text: string): Promise<any> {
  try {
    const params = {
      Text: text,
      OutputFormat: 'mp3',
      VoiceId: 'Joanna',
      Engine: 'neural'
    };
    
    const result = await polly.synthesizeSpeech(params).promise();
    return {
      audioStream: result.AudioStream,
      service: 'aws-polly'
    };
  } catch (error) {
    throw new Error(`AWS Polly error: ${error.message}`);
  }
}

// Translation using Amazon Translate (Free Tier: 2M characters/month)
export async function translateTextAWS(text: string, targetLanguage: string = 'es'): Promise<any> {
  try {
    const params = {
      Text: text,
      SourceLanguageCode: 'en',
      TargetLanguageCode: targetLanguage
    };
    
    const result = await translate.translateText(params).promise();
    return {
      translatedText: result.TranslatedText,
      sourceLanguage: result.SourceLanguageCode,
      targetLanguage: result.TargetLanguageCode,
      service: 'aws-translate'
    };
  } catch (error) {
    throw new Error(`AWS Translate error: ${error.message}`);
  }
}

// Invoke Lambda function for complex AI processing
export async function invokeLambdaAI(service: string, data: any): Promise<any> {
  try {
    const params = {
      FunctionName: process.env.AI_LAMBDA_FUNCTION_NAME || 'trtr-platform-ai-processing',
      Payload: JSON.stringify({ service, data })
    };
    
    const result = await lambda.invoke(params).promise();
    const response = JSON.parse(result.Payload as string);
    
    if (response.statusCode === 200) {
      return JSON.parse(response.body);
    } else {
      throw new Error(`Lambda function error: ${response.body}`);
    }
  } catch (error) {
    throw new Error(`AWS Lambda error: ${error.message}`);
  }
}

// Business Intelligence using multiple AWS services
export async function generateBusinessInsightsAWS(businessData: string): Promise<string> {
  try {
    // Extract entities and sentiment
    const [entities, sentiment] = await Promise.all([
      detectEntitiesAWS(businessData),
      detectSentimentAWS(businessData)
    ]);
    
    // Generate insights based on AWS analysis
    const insights = {
      sentiment: sentiment.sentiment,
      confidence: Math.max(...Object.values(sentiment.confidence)),
      keyEntities: entities.entities
        .filter((entity: any) => entity.Score > 0.8)
        .map((entity: any) => ({
          text: entity.Text,
          type: entity.Type,
          confidence: entity.Score
        })),
      recommendations: generateRecommendations(sentiment.sentiment, entities.entities)
    };
    
    return JSON.stringify(insights, null, 2);
  } catch (error) {
    throw new Error(`AWS Business Intelligence error: ${error.message}`);
  }
}

function generateRecommendations(sentiment: string, entities: any[]): string[] {
  const recommendations = [];
  
  if (sentiment === 'NEGATIVE') {
    recommendations.push('Focus on customer satisfaction improvements');
    recommendations.push('Implement feedback collection mechanisms');
  } else if (sentiment === 'POSITIVE') {
    recommendations.push('Leverage positive feedback for marketing');
    recommendations.push('Scale successful initiatives');
  }
  
  const organizationEntities = entities.filter(e => e.Type === 'ORGANIZATION');
  if (organizationEntities.length > 0) {
    recommendations.push('Consider partnerships with mentioned organizations');
  }
  
  const personEntities = entities.filter(e => e.Type === 'PERSON');
  if (personEntities.length > 0) {
    recommendations.push('Engage with key stakeholders identified');
  }
  
  return recommendations;
}