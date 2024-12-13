import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TokenValidationGuard } from 'src/guards/token-validation.guard';
import { DiagnosisService } from 'src/diagnosis/diagnosis.service';
import { ScanHistoryService } from 'src/scan-history/scan-history.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('scan-history')
export class ScanHistoryController {
  constructor(
    private readonly diagnosisService: DiagnosisService,
    private readonly scanHistoryService: ScanHistoryService,
  ) { }

  @Post('diagnose')
  @UseGuards(TokenValidationGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Folder for uploads
        filename: (req, file, callback) => {
          // Generate a unique filename with the original extension
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = extname(file.originalname); // Get original file extension
          const filename = `${uniqueSuffix}${extension}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async diagnoseImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: any,
    @Body() body: { advice?: string },
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    console.log(file)
    const filePath = file.path;
    const user = request.user;

    try {
      // Step 1: Upload the image to Cloudinary
      const uploadResult = await this.diagnosisService.cloudinaryService.uploadImage(filePath);
      const imageUrl = uploadResult.secure_url;
      // Step 2: Save the initial ScanHistory record
      const scanHistory = await this.scanHistoryService.createScanHistory({
        scanDate: new Date(),
        imageUrl,
        scannedBy: user.id,
        advice: body.advice || '', // Optional advice field
        result: '', // Placeholder until diagnosis result is ready
        diseaseId: null, // Placeholder for disease relationship
      });

      // Step 3: Run the Python diagnosis script
      const diagnosisResult = await this.diagnosisService.runDiagnosis(imageUrl);

      // Step 4: Update ScanHistory with diagnosis result
      const updatedScanHistory = await this.scanHistoryService.updateScanHistory(scanHistory.id, {
        diseaseId: diagnosisResult['rep_skin_detection'].data.diagnosis.id,
        result: JSON.stringify(diagnosisResult),
        advice: body.advice || this.generateAdvice(diagnosisResult['rep_skin_detection'].data.diagnosis.id), // Generate advice dynamically
      });

      return {
        message: 'Diagnosis completed successfully',
        scanHistory: updatedScanHistory,
      };
    } catch (error) {
      console.error('Error during diagnosis workflow:', error);
      throw new BadRequestException('Failed to diagnose image');
    } finally {
      // Clean up the temporary file
      await this.deleteTemporaryFile(filePath);
    }
  }

  private async deleteTemporaryFile(filePath: string): Promise<void> {
    const fs = require('fs/promises');
    try {
      await fs.unlink(filePath);
      console.log(`Temporary file deleted: ${filePath}`);
    } catch (error) {
      console.error(`Failed to delete temporary file: ${filePath}`, error);
    }
  }

  private generateAdvice(id: number): string {
    // Custom logic to generate advice based on the diagnosis result
    switch (id) {
      case 2:
        return 'Actinic keratoses (AKs) are rough, scaly patches caused by prolonged sun exposure and are considered precancerous, as they can develop into squamous cell carcinoma. Early treatment is essential to prevent progression. Options include topical medications like 5-fluorouracil and imiquimod, which target abnormal cells, and procedures such as cryotherapy, photodynamic therapy, or laser resurfacing to remove or destroy lesions. Regular dermatologist visits and diligent sun protection are critical for managing AKs and preventing further skin damage.';
      case 3:
        return 'Preventive measures are vital. Use broad-spectrum sunscreen, avoid excessive sun exposure, and perform regular skin self-checks. If you notice any pearly, pink, or ulcerated growths, consult a dermatologist promptly. Regular follow-ups are essential to monitor for recurrence or new lesions.';
      case 4:
        return 'There is no way to prevent BKLs as they are associated with aging and genetics rather than sun exposure. However, regular self-skin exams and dermatologist visits are advised to distinguish these lesions from potentially harmful ones. If a lesion changes in size, color, or texture, seek professional evaluation to rule out skin cancer.';
      case 5:
        return 'Dermatofibroma (DF) is a common, benign skin growth that appears as a small, firm nodule, often on the lower legs. It is typically harmless, but may occasionally cause itching or tenderness. Treatment is usually unnecessary unless the lesion is bothersome, in which case options like surgical removal or cryotherapy can be considered. Regular monitoring is advised to ensure no changes suggestive of other conditions.';
      case 6:
        return 'Treatment typically involves surgical excision, with advanced cases requiring immunotherapy, targeted therapy, chemotherapy, or radiation. Regular skin checks and self-examinations using the ABCDE rule (Asymmetry, Border irregularity, Color variation, Diameter over 6mm, and Evolution) are critical for early detection. Protecting your skin from UV exposure is the most effective prevention strategy.';
      case 7:
        return 'No treatment is typically necessary unless the mole causes discomfort, irritation, or cosmetic concerns. However, it’s essential to monitor moles for changes in size, shape, or color, as these could indicate melanoma, a type of skin cancer. Regular skin checks and prompt evaluation of atypical moles are key to maintaining skin health.';
      case 8:
        return 'Treatment options vary based on the type and severity of the lesion. These include laser therapy, sclerotherapy (for spider veins), or surgical removal for larger or problematic lesions. In many cases, vascular lesions do not require treatment unless they interfere with function or cause significant distress. Regular monitoring and consultation with a dermatologist or vascular specialist are recommended for proper management.';
      default:
        return 'Contact a healthcare professional for further evaluation.';
    }
  }
}
