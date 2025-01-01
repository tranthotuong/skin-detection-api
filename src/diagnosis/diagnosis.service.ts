import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as path from 'path';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class DiagnosisService {
  constructor(public readonly cloudinaryService: CloudinaryService) {}

  /**
   * Handles the diagnosis workflow.
   * 1. Uploads the image to Cloudinary.
   * 2. Runs the Python script using the image URL from Cloudinary.
   * @param filePath - Local file path of the image to process.
   * @returns Diagnosis result from the Python script.
   */
  async runDiagnosis(filePath: string): Promise<string> {
    try {
      // Step 1: Upload the image to Cloudinary and get its URL
      // const uploadResult = await this.cloudinaryService.uploadImage(filePath);
      // const imageUrl = uploadResult.secure_url;
      // console.log(`Image uploaded to Cloudinary: ${imageUrl}`);


      // Step 2: Call the Python script with the Cloudinary image URL
      const diagnosis = await this.callPythonScript(filePath);
      console.log(`Diagnosis result: ${diagnosis}`);

      return diagnosis;
    } catch (error) {
      console.error('Error in diagnosis workflow:', error);
      throw new Error('Failed to complete diagnosis');
    }
  }

  /**
   * Calls the Python script with the provided image URL.
   * @param imageUrl - URL of the image uploaded to Cloudinary.
   * @returns Diagnosis result as a string.
   */
  private callPythonScript(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Construct the full path to the Python script
      const scriptPath = path.join(__dirname, `../../../${process.env.MODEL_SKIN_PATH}`);
      
      // Execute the Python script with the image URL as an argument
      const command = `python ${scriptPath} --image_url "${imageUrl}"`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error in Python script: ${stderr}`);
          reject(new Error(`Python script error: ${stderr || error.message}`));
          return;
        }
        // Find the JSON part in the output
        const startIndex = stdout.indexOf('{"rep_skin_detection"');
        if (startIndex === -1) {
          reject(new Error('No valid JSON found in Python script output.'));
          return;
        }

        const jsonString = stdout.substring(startIndex).trim();

        try {
          // Parse the output if it's expected to be JSON
          const output = JSON.parse(jsonString);
          resolve(output);
        } catch (parseError) {
          console.error('Failed to parse Python script output:', stdout);
          reject(new Error(`Failed to parse Python script output: ${jsonString}`));
        }
      });
    });
  }
}
