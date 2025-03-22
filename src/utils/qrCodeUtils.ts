import qrcode from 'qrcode';

export const generateQRCode = async (data: string): Promise<string> => {
    return await qrcode.toDataURL(data);
};