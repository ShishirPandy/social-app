const User=require('../models/user');
const bcrypt=require('bcryptjs');
exports.createUser=async (req,res)=>{
    try {
        const { name, mobileNo, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, mobileNo, email, password: hashedPassword });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateUser=async (req,res)=>{
    try {
        const {id}=req.body;
        const updates=req.body;
        if(updates.password){
            updates.password=await bcrypt.hash(updates.password,10);

        }
        const user=await User.findByIdandUpdate(id,updates,{new:true});
        if(!user) return res.status(404).json({message:'User not found'});
        res.status(200).json(user);
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

exports.deleteUser=async (req,res)=>{
 try {
    const {id}=req.params;
    const user=await User.findByIdandDelete(id);
    if(!user) return res.status(404).json({message:'User not found'});
    res.status(200).json({message:'User deleted successfully'})
 } catch (error) {
    res.status(500).json({error:error.message});
 }
};
exports.listUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Search User by Name
exports.searchUserByName = async (req, res) => {
    try {
        const { name } = req.query;
        const users = await User.find({ name: new RegExp(name, 'i') });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.followUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.user;

        const userToFollow = await User.findById(id);
        if (!userToFollow) return res.status(404).json({ message: 'User not found' });

        const currentUser = await User.findById(userId);
        if (currentUser.following.includes(id)) {
            return res.status(400).json({ message: 'Already following this user' });
        }

        currentUser.following.push(id);
        userToFollow.followers.push(userId);

        await currentUser.save();
        await userToFollow.save();

        res.status(200).json({ message: 'User followed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
