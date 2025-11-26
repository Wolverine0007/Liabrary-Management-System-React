# AWS Deployment Guide

## Architecture
- **Frontend**: S3 + CloudFront
- **Backend**: EC2 or Lambda + API Gateway
- **Database**: RDS MySQL
- **Optional**: Load Balancer, Route 53

## Option 1: Simple AWS (Recommended)
### Frontend (S3 + CloudFront)
1. Build: `npm run build`
2. Upload `build/` to S3 bucket
3. Enable static website hosting
4. Add CloudFront for CDN

### Backend (EC2)
1. Launch t2.micro EC2 instance
2. Install Node.js and MySQL
3. Deploy backend code
4. Configure security groups

### Database (RDS)
1. Create RDS MySQL instance (t3.micro)
2. Configure security groups
3. Update connection credentials

## Option 2: Serverless AWS
### Frontend (S3 + CloudFront)
Same as Option 1

### Backend (Lambda + API Gateway)
1. Convert Express routes to Lambda functions
2. Use API Gateway for routing
3. Deploy with AWS SAM or Serverless Framework

### Database (RDS or DynamoDB)
- RDS MySQL (relational)
- DynamoDB (NoSQL - requires code changes)

## Cost Estimate (Monthly)
- EC2 t2.micro: $8-10
- RDS t3.micro: $15-20
- S3 + CloudFront: $1-5
- **Total**: ~$25-35/month

## Free Tier Usage
- EC2: 750 hours/month (1 year)
- RDS: 750 hours/month (1 year)
- S3: 5GB storage
- CloudFront: 50GB transfer