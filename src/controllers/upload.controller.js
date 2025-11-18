import cloudinary from "../lib/cloudinary.js";

export const uploaImages = async (req,res) =>{
    try {

        //Agar file image nhi hai ya length jada hai then
        if(!req.files || req.files.length === 0){
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            })
        }
        //Upload each files to cloudinary  
        const uploadPromises = req.files.map(
            file =>{
                return new Promise((resolve, reject) =>{
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'proboat/properties',
                            resource_type: 'image',
                            transformation: [
                                {
                                    width: 1200, height: 800, crop: 'limit'
                                },
                                {
                                    quality: 'auto'
                                },
                                {
                                    fetch_format: 'auto'
                                }
                            ]
                        },
                        (error, result) =>{
                            if(error){
                                reject(error);
                            }else{
                                resolve({
                                    url: result.secure_url,
                                    publicId: result.public_id
                                });
                            }
                        }
                    
                    );
                    uploadStream.end(file.buffer);
                })
            }
        );
        const uploadedImages = await Promise.all(uploadPromises);
        res.status(200).json({
            success:true,
            message: 'Images Uploaded succesfully',
            images: uploadedImages
        })
        
    } catch (error) {
        console.log('Error in uploadedImages:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to uplaod images'
        })
        
    }
}



export const deleteImage = async (req,res) =>{
    try {
        
    } catch (error) {
        
    }
}


