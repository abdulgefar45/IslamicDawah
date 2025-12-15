const express = require('express');
const Question = require('../models/Question');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all questions (public)
router.get('/', async (req, res) => {
    try {
        const { category, status, limit = 10, page = 1 } = req.query;
        
        const query = { isPublic: true, status: 'answered' };
        
        if (category) {
            query.category = category;
        }
        
        const questions = await Question.find(query)
            .populate('userId', 'name')
            .populate('answer.answeredBy', 'name')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));
            
        const total = await Question.countDocuments(query);
        
        res.json({
            questions,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Submit a question (requires auth)
router.post('/', auth, async (req, res) => {
    try {
        const { question, category } = req.body;
        
        const newQuestion = new Question({
            userId: req.user.userId,
            question,
            category
        });
        
        await newQuestion.save();
        
        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Answer a question (admin only)
router.put('/:id/answer', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        
        const { answer, references } = req.body;
        
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        
        question.answer = {
            text: answer,
            answeredBy: req.user.userId,
            answeredAt: new Date(),
            references: references || []
        };
        question.status = 'answered';
        
        await question.save();
        
        res.json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
