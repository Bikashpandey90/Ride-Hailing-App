const bcrypt = require("bcryptjs");
const fileUploaderSvc = require("../../services/fileuploader.service");
const emailSvc = require("../../services/mail.service");
const { randomStringGenerator } = require("../../utilities/helpers");
const UserModel = require("../user.model");
const RiderModel = require("../rider.model");



class AuthService {

    transformUserRegister = async (req) => {
        try {
            let data = req.body;
            const salt = bcrypt.genSaltSync(10)
            data.password = bcrypt.hashSync(data.password, salt)
            delete data.confirmPassword

            let file = req.file

            if (file) {
                data.image = await fileUploaderSvc.uploadFile(file.path, '/ridousers')
            }
            data.otp = randomStringGenerator(6, false)
            data.otpExpiryTime = new Date(Date.now() + 300000)
            data.status = "inactive"


            return data


        } catch (exception) {
            console.log("Transform User Register", exception)
            throw exception
        }


    }

    createUser = async (data) => {
        try {
            const userObj = new UserModel(data)
            return await userObj.save()
        } catch (exception) {
            console.log("Create User", exception)
            throw exception
        }
    }
    createRider = async (data) => {
        try {
            const userObj = new RiderModel(data)
            return await userObj.save()
        } catch (exception) {
            console.log("Create User", exception)
            throw exception
        }
    }

    sendActivationNotification = async (name, otp, email) => {
        try {
            let msg = `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Account Activation</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 20px auto;
                        background: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        padding: 10px 0;
                        font-size: 24px;
                        font-weight: bold;
                        color: #333;
                    }
                    .content {
                        font-size: 16px;
                        color: #555;
                        line-height: 1.6;
                    }
                    .otp {
                        font-size: 20px;
                        font-weight: bold;
                        color: grey;
                        text-align: center;
                        padding: 10px;
                        background: #f8f8f8;
                        border-radius: 5px;
                        margin: 20px 0;
                    }
                    .footer {
                        font-size: 12px;
                        text-align: center;
                        color: #888;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">Account Activation</div>
                    <div class="content">
                        <p>Dear ${name},</p>
                        <p>Thank you for registering with us. Please activate your account by using the following OTP code:</p>
                        <div class="otp">${otp}</div>
                        <p>Warm regards,</p>
                        <p>${process.env.SMTP_FROM}</p>
                    </div>
                    <div class="footer">
                        <em>Please do not reply to this email directly.</em>
                    </div>
                </div>
            </body>
            </html>
            `
            //              `<!DOCTYPE html>
            // <html lang="en">
            // <head>
            //     <meta charset="UTF-8">
            //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
            //     <title>Document</title>
            //     <style>
            //         * {
            //             margin: 0;
            //             padding: 0;
            //             box-sizing: border-box;
            //         }

            //         body {
            //             font-family: sans-serif;
            //             background-color: #f7f7f7;
            //             color: #333;
            //         }

            //         .email-container {
            //             width: 100%;
            //             max-width: 600px;
            //             margin: auto;
            //             background-color: #fff;
            //             border-radius: 8px;
            //             padding: 20px 40px;
            //             overflow: hidden;
            //         }

            //           .header {
            //             display: flex;
            //             justify-content: space-between;
            //             align-items: center;
            //             margin-bottom: 20px;
            //         }

            //         .logo {
            //             display: flex;
            //             align-items: center;
            //             text-decoration: none;
            //             color: #333;
            //         }

            //         .logo svg {
            //             width: 40px;
            //             height: 40px;
            //         }

            //         .logo span {
            //             font-size: 24px;
            //             font-weight: 600;
            //             margin-left: 10px;
            //         }

            //         .link-to-webtite {
            //             font-size: 14px;
            //             text-decoration: none;
            //             color: #333;
            //             text-decoration: underline;
            //         }

            //         .hero-content img {
            //             width: 100%;
            //             border-radius: 8px;
            //             margin-bottom: 20px;\
            //             background-color: #ffffff;
            //         }

            //         .content .title {
            //             font-size: 20px;
            //             font-weight: 600;
            //             margin-bottom: 10px;
            //         }

            //         .content p {
            //             font-size: 16px;
            //             color: #555;
            //             margin-bottom: 15px;
            //             line-height: 1.6;
            //         }

            //         .otp-box {
            //             font-size: 28px;
            //             font-weight: bold;
            //             color: #333;
            //             background-color: #f1f1f1;
            //             padding: 15px;
            //             border-radius: 8px;
            //             letter-spacing: 5px;
            //             text-align: center;
            //             margin: 20px 0;
            //         }

            //         .signature {
            //             font-size: 15px;
            //             color: #777;
            //             border-top: 1px solid #e0e0e0;
            //             padding-top: 15px;
            //             margin-top: 20px;
            //         }

            //         .footer {
            //             margin-top: 30px;
            //             text-align: center;
            //         }

            //         .footer p {
            //             color: #777;
            //             font-size: 14px;
            //             margin-bottom: 10px;
            //         }

            //         .social-container {
            //             display: flex;
            //             justify-content: center;
            //             gap: 15px;
            //         }

            //         .social-container img {
            //             width: 36px;
            //             height: 36px;
            //             border-radius: 50%;
            //         }

            //         .copyright {
            //             text-align: center;
            //             font-size: 12px;
            //             color: #aaa;
            //             margin-top: 20px;
            //         }
            //     </style>
            // </head>

            // <body>
            //     <div class="email-container">
            //         <div class="header">
            //             <a href="#" class="logo" style="text-decoration: none; color: #333; gap: 10px;">
            //                 <svg width="40" height="auto" viewBox="0 0 50 39" fill="none" xmlns="http://www.w3.org/2000/svg"
            //                     style="fill: #333;">
            //                     <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" stopColor="#000000"></path>
            //                     <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
            //                         stopColor="#000000"></path>
            //                 </svg>
            //                 <span style="font-size: 30px; font-weight: 600; color: #333;margin-left: 10px;">RideX</span>
            //                 <!-- <img src="https://example.com/logo.png" alt="Logo"> -->
            //             </a>
            //             <a href="#" class="link-to-webtite">View in Browser</a>
            //         </div>
            //         <div class="hero-content">
            //             <img src="https://cdni.iconscout.com/illustration/premium/thumb/boy-sending-thank-you-email-illustration-download-in-svg-png-gif-file-formats--letter-message-communication-pack-miscellaneous-illustrations-10892635.png?f=webp"
            //                 alt="Hero Image">
            //         </div>
            //         <div class="content">
            //             <p class="title">Dear <span>${name},</span></p>
            //             <p> Thank you for signing in. Please use the One-Time Password (OTP) below to complete your login process.
            //                 This OTP is valid for the next 10 minutes. Do not share it with anyone.</p>
            //             <div class="otp-box">${otp}</div>
            //         </div>
            //         <div class="signature">
            //             <p>Best Regards,</p>
            //             <p>RideX</p>
            //         </div>
            //         <div class="footer">
            //             <p style="display: flex; align-self: center; justify-self: center;color: gray;margin-top: 10px;">Stay in
            //                 Touch</p>
            //             <div class="social-container">
            //                 <a href="#" class="facebook">
            //                     <img src="https://yt3.googleusercontent.com/RhsrKM2HugvjGkbHXmo93C-q3qZLJk9hzfeJHmproNh4qb6UA5cC--l0mTZ2QuM-yXF1wYijgw=s900-c-k-c0x00ffffff-no-rj"
            //                         alt="Facebook">
            //                 </a>
            //                 <a href="#" class="linkedin">
            //                     <img src="https://yt3.googleusercontent.com/i6KNxiy3gME-BulL4WnuGkTGqHuSYF8jl1WRn0rXftcJdSYK7dHKcJ3gLAaPc-KfhmLSYPwf824=s900-c-k-c0x00ffffff-no-rj"
            //                         alt="Twitter">
            //                 </a>
            //                 <a href="#" class="github">
            //                     <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/GitHub_Invertocat_Logo.svg/1200px-GitHub_Invertocat_Logo.svg.png"
            // alt="LinkedIn">
            //                 </a>
            //             </div>
            //             <div class="copyright">
            //                 <p style="margin-bottom: 3px;">
            //                     Email Sent by RideX
            //                 </p>
            //                 <p>Copyright © 2023 RideX. All rights reserved.</p>
            //             </div>
            //         </div>
            //     </div>
            // </body>

            // </html>`



            await emailSvc.sendEmail({
                to: email,
                subject: "Registration Success",
                message: msg,
            });

        } catch (exception) {
            console.log(exception)
            throw exception

        }
    }
    getSingleUserByFilter = async (filter) => {
        try {
            const user = await UserModel.findOne(filter)
            if (!user) {
                throw { code: 422, message: "User not found", status: "USER_NOT_FOUND" }
            }
            return user
        } catch (exception) {
            console.log("Get Single User By Filter", exception)
            throw exception
        }
    }
    getSingleRiderByFilter = async (filter) => {
        try {
            console.log("Filter for Rider Search:", filter); // Debugging
            const user = await RiderModel.findOne(filter)
            if (!user) {
                throw { code: 422, message: "Rider not found", status: "RIDer_NOT_FOUND" }
            }
            return user
        } catch (exception) {
            console.log("Get Single User By Filter", exception)
            throw exception
        }
    }
    activateUser = async (user) => {
        try {
            user.otp = null
            user.otpExpiryTime = null
            user.status = "active"
            return await user.save()

        } catch (exception) {
            console.log("Activate User", exception)
            throw exception
        }
    }
    activateRider = async (user) => {
        try {
            user.otp = null
            user.otpExpiryTime = null
            user.status = "active"
            return await user.save()

        } catch (exception) {
            console.log("Activate User", exception)
            throw exception
        }
    }
    getAllUsers = async (filter) => {
        try {
            const users = await UserModel.find(filter, {
                password: 0,
                otp: 0,
                otpExpiryTime: 0,
                _v: 0,


            }).sort({
                createdAt: "desc"

            })
            const riders = await RiderModel.find(filter, {
                password: 0,
                otp: 0,
                otpExpiryTime: 0,
                _v: 0,
                nid: 0,
                license: 0,
                vehicle: 0,


            }).sort({
                createdAt: "desc"

            })


            return [...users, ...riders];

        } catch (exception) {
            throw exception
        }

    }
    getSingleUserById = async (id) => {
        try {
            const user = await UserModel.findById(id, {
                password: 0,
                otp: 0,
                otpExpiryTime: 0,
                _v: 0,
            })
            return user;
        } catch (exception) {
            throw exception
        }
    }
    getSingleRiderById = async (id) => {
        try {
            const rider = await RiderModel.findById(id, {
                password: 0,
                otp: 0,
                otpExpiryTime: 0,
                _v: 0,
            })
            return rider;

        } catch (exception) {
            throw exception
        }
    }
    getAllRiders = async () => {
        try {
            let filter = {

            }
            const riders = await RiderModel.find(filter, {
                password: 0,
                otp: 0,
                otpExpiryTime: 0,
                _v: 0,
            }).sort({
                createdAt: "desc"

            })



            return riders

        } catch (exception) {
            throw exception
        }
    }
    updateMyLocation = async (userId, location) => {
        try {
            const response = await RiderModel.findByIdAndUpdate(
                userId,
                {
                    location: location
                },
                {
                    new: true
                })
            return response

        } catch (exception) {
            console.log("updateMyLocation", exception)
            throw exception
        }
    }
    updateMyLocationUser = async (userId, location) => {
        try {
            const response = await UserModel.findByIdAndUpdate(
                userId,
                {
                    location: location
                },
                {
                    new: true
                })
            return response

        } catch (exception) {
            console.log("updateMyLocation", exception)
            throw exception
        }
    }
    updateRideStatus = async (userId, status) => {
        try {
            const response = await RiderModel.findByIdAndUpdate(
                userId,
                {
                    isAvailable: status
                },
                {
                    new: true
                })
                .select({
                    isAvailable: 1
                })

            return response

        } catch (exception) {
            console.log("updateRideStatus", exception)
            throw exception
        }
    }


}
const authSvc = new AuthService();
module.exports = authSvc;