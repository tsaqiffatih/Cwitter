const published = require('../helper/published');
const {User, Profile, Tag, Post, PostTag} = require('../models');
const bcryptjs = require('bcryptjs');
const { Op } = require('sequelize');
const fs = require('fs');

class Controller {

    static async postRegister(req, res){
        try {
            let {email, password, name, address} = req.body;
            let user = await User.create({email, password});
            await Profile.create({name, address, UserId: user.id})
            res.redirect('/login');
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                let errors = error.errors.map((e) => {
                    return e.message;
                });
                res.send(errors[0]); // Mengirim pesan kesalahan pertama saja
            } else {
                res.send(error)
            }
        }
    }

    static async getLogin(req, res) {
        try {
            const { error } = req.query
            res.render('Login', {error})
        } catch (error) {
            res.send(error)
        }
    }

    static async postLogin(req, res) {
        try {
            let { email, password } = req.body
            let user = await User.findOne({ where: { email: email } })
            // const userId = user.id;
            if (user) {
                req.session.role = user.role
                req.session.userId = user.id
                const isValidPassword = bcryptjs.compareSync(password, user.password)
                if (isValidPassword) {
                    res.redirect('/post')
                } else {
                    const error = "Invalid password!!"
                    res.redirect(`/Login?error=${error}`)
                }
            } else {
                const error = "Invalid Email!!"
                res.redirect(`/Login?error=${error}`)
            }
            
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async getLogout(req, res) {
        req.session.destroy((err) => {
            if (err) res.send(err)
            else {
                res.redirect('/')
            }
        })
    }

    static async getPost(req, res){
        try {
            let data = await Profile.findAll({
                include: [
                  {
                    model: Post,
                    include: [Tag]
                  }
                ],
                where: {
                    '$Posts.id$': { [Op.not]: null } 
                },
                order: [[{ model: Post }, 'createdAt', 'DESC']]
              })
              let id = req.session.userId;
            res.render('Contents', {data, published, id})
        } catch (error) {
            res.send(error)
        }
    }

    static async getProfiles(req, res){
        try {
            let { search } = req.query
            const { error } = req.query
            let option = {
            where: {}
            }
            if (search) {
            option.where.name = { [Op.iLike]: `%${search}%` }
            }
            let data = await Profile.findAll(option)
            let totalUser = await Profile.getTotalUser();
            let id = req.session.userId;
            res.render('ListProfile', {data, totalUser, error, id})
        } catch (error) {
            res.send(error)
        }
    }

    static async getProfilesDetails(req, res){
        try {
            let {id} = req.params;
            let data = await Profile.findAll({
                include: [
                    {
                    model: Post,
                    include: [Tag] // Mengambil data Tag yang terkait dengan Post
                    }
                  ],
                where: { id }
            })
            let user = await User.findByPk(id)
            // res.send(data)
            res.render('ProfileDetails', {data, published, user})
        } catch (error) {
            res.send(error)
        }
    }

    static async getAddContent(req, res){
        try {
            let {id} = req.params;
            let data = await Profile.findAll({
                include: [
                    {
                    model: Post,
                    include: [Tag]
                    }
                  ],
                where: { id },
                order: [[{ model: Post }, 'createdAt', 'DESC']] 
            })
 
            let tag = await Tag.findAll();
            res.render('MyProfile', {data, published, tag})
        } catch (error) {
            res.send(error)
        }
    }

    static async postAddContent(req, res){
        try {
            let { id } = req.params;
            let { content, hashTag } = req.body;
            let post = await Post.create({content, ProfileId: id});
            if(hashTag.length > 1) {
                hashTag = hashTag.map( async (e)=> {
                    await PostTag.create({PostId: post.id, TagId: e})
                })
            } else {
                await PostTag.create({PostId: post.id, TagId: hashTag})
            }
            res.redirect(`/myprofiles/${id}`)
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async getEditProfile(req, res) {
        try {
            let {id} = req.params;
            let data = await Profile.findByPk(id)
            res.render('EditUser', {data});
        } catch (error) {
            console.log(error)
            res.send(error);
        }
    }

    static async postEditProfile(req, res) {
        try {
            const {id} = req.params;
        const data = await Profile.findByPk(id);
        const {name, address} = req.body;
        // Periksa apakah file diunggah
        if (req.files && req.files.photoProfile) {
            const photoProfile = req.files.photoProfile;
            // Simpan file ke direktori yang diinginkan
            const directory = './uploads';
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
            }
            const filePath = `${directory}/${data.id}.${photoProfile.mimetype.split('/')[1]}`;
            await photoProfile.mv(filePath);
            const url = `http://localhost:3000/uploads/${data.id}.${photoProfile.mimetype.split('/')[1]}`;
            // Update path foto profil di database
            await data.update({name, address, photoProfile: url});

        } else {
            await data.update({name, address});
        }
        res.redirect(`/myprofiles/${id}`);
        } catch (error) {
            console.log(error)
            res.send(error);
        }
    }

    static async getDeleteContent(req, res) {
        try {
            let id = req.params.id;
            let postId = req.params.postId
            let post = await Post.findByPk(postId);
            if (!post) throw new Error('Post not found!');
            await PostTag.destroy({ where: { PostId: postId } });
            await post.destroy();
            res.redirect(`/myprofiles/${id}`);
        } catch (error) {
            console.log(error)
            res.send(error);
        }
    }

}

module.exports = Controller;