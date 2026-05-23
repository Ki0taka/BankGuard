import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiExtractionService {
  private readonly logger = new Logger(AiExtractionService.name);
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
  }

  async extractEntityInfo(text: string): Promise<any> {
    if (!this.model) {
      throw new Error(
        'AI Extraction service is not configured (missing GOOGLE_API_KEY).',
      );
    }

    const prompt = `
      Extract structured information about a sanctioned person or organization from the following text.
      Return the result as a strictly valid JSON object.
      
      The fields should be:
      - fullName (most important)
      - name1, name2, name3, name4, name5, name6 (if name parts are identifiable)
      - dob (format: YYYY-MM-DD or part thereof)
      - nationality
      - townOfBirth
      - countryOfBirth
      - addresses (array of strings)
      - passportNum
      - nationalId
      - groupType (Must be exactly 'INDIVIDUAL' or 'ORGANIZATION')
      - otherInfo (any additional context)
      - registrationNumber (for organizations)
      - industry (for organizations)
      
      Text to extract from: "${text}"
      
      Rules:
      1. If a field is unknown, omit it or set to null.
      2. Ensure JSON is strictly valid.
      3. No conversational text, only the JSON object.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let jsonStr = response.text();

      // Clean up potential markdown formatting
      jsonStr = jsonStr
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      return JSON.parse(jsonStr);
    } catch (error) {
      this.logger.error(`AI Extraction failed: ${error.message}`);
      throw new Error(`AI Extraction failed: ${error.message}`);
    }
  }
}
