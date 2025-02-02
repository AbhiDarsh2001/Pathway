import React, { useState } from "react";
import axios from "axios";
import "./AddTest.css";

const ManMockTestForm = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        duration: "",
        totalMarks: "",
        numberOfQuestions: "",
        passingMarks: "",
        questions: []
    });

    const [currentQuestion, setCurrentQuestion] = useState({
        questionText: "",
        options: [{ optionText: "", isCorrect: false }],
        marks: "",
        steps: [""]
    });

    // Handle input changes for test fields
    const handleChange = (e) => {
        // Add validation for numberOfQuestions
        if (e.target.name === 'numberOfQuestions') {
            const value = parseInt(e.target.value);
            if (value < formData.questions.length) {
                alert(`Cannot set number of questions less than current questions count (${formData.questions.length})`);
                return;
            }
        }
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle question input changes
    const handleQuestionChange = (e) => {
        setCurrentQuestion({ ...currentQuestion, [e.target.name]: e.target.value });
    };

    // Handle option input changes
    const handleOptionChange = (index, field, value) => {
        const updatedOptions = [...currentQuestion.options];
        updatedOptions[index][field] = value;
        setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
    };

    // Add new option to the current question
    const handleAddOption = () => {
        setCurrentQuestion({
            ...currentQuestion,
            options: [...currentQuestion.options, { optionText: "", isCorrect: false }]
        });
    };

    // Handle step input changes
    const handleStepChange = (index, value) => {
        const updatedSteps = [...currentQuestion.steps];
        updatedSteps[index] = value;
        setCurrentQuestion({ ...currentQuestion, steps: updatedSteps });
    };

    // Add new step to the question
    const handleAddStep = () => {
        setCurrentQuestion({ ...currentQuestion, steps: [...currentQuestion.steps, ""] });
    };

    // Validate and add question
    const handleAddQuestion = () => {
        // First check if number of questions is set
        if (!formData.numberOfQuestions) {
            alert("Please set the total number of questions first");
            return;
        }

        // Check if we've reached the question limit
        if (formData.questions.length >= parseInt(formData.numberOfQuestions)) {
            alert(`Cannot add more questions. Maximum limit of ${formData.numberOfQuestions} questions has been reached.`);
            return;
        }

        // Validate question fields
        if (!currentQuestion.questionText.trim()) {
            alert("Please enter question text.");
            return;
        }
        if (!currentQuestion.marks || parseInt(currentQuestion.marks) <= 0) {
            alert("Please enter valid marks for the question.");
            return;
        }
        
        // Validate options
        if (currentQuestion.options.length < 2) {
            alert("Please add at least two options.");
            return;
        }
        
        if (!currentQuestion.options.some(option => option.isCorrect)) {
            alert("Please mark at least one option as correct.");
            return;
        }
        
        if (currentQuestion.options.some(option => !option.optionText.trim())) {
            alert("Please fill in all option texts.");
            return;
        }

        // Validate steps
        if (currentQuestion.steps.some(step => !step.trim())) {
            alert("Please fill in all steps.");
            return;
        }

        // Calculate total marks including the new question
        const totalMarksWithNewQuestion = formData.questions.reduce(
            (sum, q) => sum + parseInt(q.marks), 0
        ) + parseInt(currentQuestion.marks);

        if (totalMarksWithNewQuestion > parseInt(formData.totalMarks)) {
            alert(`Adding this question would exceed the total marks limit of ${formData.totalMarks}`);
            return;
        }

        setFormData({
            ...formData,
            questions: [...formData.questions, currentQuestion]
        });

        // Reset current question
        setCurrentQuestion({
            questionText: "",
            options: [{ optionText: "", isCorrect: false }],
            marks: "",
            steps: [""]
        });

        // Show remaining questions count
        const remainingQuestions = parseInt(formData.numberOfQuestions) - (formData.questions.length + 1);
        if (remainingQuestions > 0) {
            alert(`Question added successfully! ${remainingQuestions} more question(s) to add.`);
        } else {
            alert("All questions have been added successfully!");
        }
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate if there are any questions added
        if (formData.questions.length === 0) {
            alert("Please add at least one question before submitting.");
            return;
        }

        // Validate if number of questions matches actual questions added
        if (formData.questions.length !== parseInt(formData.numberOfQuestions)) {
            alert(`Please add exactly ${formData.numberOfQuestions} questions. Currently added: ${formData.questions.length}`);
            return;
        }

        // Calculate total marks from questions and validate
        const calculatedTotalMarks = formData.questions.reduce((sum, q) => sum + parseInt(q.marks), 0);
        if (calculatedTotalMarks !== parseInt(formData.totalMarks)) {
            alert(`Total marks mismatch. Sum of question marks (${calculatedTotalMarks}) should equal total marks (${formData.totalMarks})`);
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/test/add", formData);
            alert(response.data.message);
            setFormData({
                title: "",
                description: "",
                duration: "",
                totalMarks: "",
                numberOfQuestions: "",
                passingMarks: "",
                questions: []
            });
        } catch (error) {
            alert("Error adding test: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="add-test-container">
            <h2 className="add-test-title">Add Mock Test</h2>
            <form className="test-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <input 
                        type="text" 
                        name="title" 
                        placeholder="Title" 
                        value={formData.title} 
                        onChange={handleChange} 
                        required 
                        className="input-field"
                    />
                    <input 
                        type="text" 
                        name="description" 
                        placeholder="Description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        required 
                        className="input-field"
                    />
                    <input 
                        type="number" 
                        name="duration" 
                        placeholder="Duration (minutes)" 
                        value={formData.duration} 
                        onChange={handleChange} 
                        required 
                        className="input-field"
                    />
                    <input 
                        type="number" 
                        name="totalMarks" 
                        placeholder="Total Marks" 
                        value={formData.totalMarks} 
                        onChange={handleChange} 
                        required 
                        className="input-field"
                    />
                    <input 
                        type="number" 
                        name="numberOfQuestions" 
                        placeholder="Number of Questions" 
                        value={formData.numberOfQuestions} 
                        onChange={handleChange} 
                        required 
                        className="input-field"
                    />
                    <input 
                        type="number" 
                        name="passingMarks" 
                        placeholder="Passing Marks" 
                        value={formData.passingMarks} 
                        onChange={handleChange} 
                        required 
                        className="input-field"
                    />
                </div>

                {formData.numberOfQuestions && (
                    <div className="progress-indicator">
                        Questions added: {formData.questions.length} / {formData.numberOfQuestions}
                    </div>
                )}

                {(!formData.numberOfQuestions || formData.questions.length < parseInt(formData.numberOfQuestions)) ? (
                    <div className="question-section">
                        <h3 className="question-title">Add Question</h3>
                        <input 
                            type="text" 
                            name="questionText" 
                            placeholder="Question" 
                            value={currentQuestion.questionText} 
                            onChange={handleQuestionChange} 
                            required 
                            className="input-field"
                        />
                        <input 
                            type="number" 
                            name="marks" 
                            placeholder="Marks" 
                            value={currentQuestion.marks} 
                            onChange={handleQuestionChange} 
                            required 
                            className="input-field"
                        />

                        <h4 className="question-title">Options</h4>
                        <div className="options-container">
                            {currentQuestion.options.map((option, index) => (
                                <div key={index} className="option-group">
                                    <input
                                        type="text"
                                        placeholder={`Option ${index + 1}`}
                                        value={option.optionText}
                                        onChange={(e) => handleOptionChange(index, "optionText", e.target.value)}
                                        required
                                        className="input-field option-input"
                                    />
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={option.isCorrect}
                                            onChange={(e) => handleOptionChange(index, "isCorrect", e.target.checked)}
                                        />
                                        Correct
                                    </label>
                                </div>
                            ))}
                            <button type="button" onClick={handleAddOption} className="button add-button">Add Option</button>
                        </div>

                        <h4 className="question-title">Steps</h4>
                        <div className="steps-container">
                            {currentQuestion.steps.map((step, index) => (
                                <div key={index}>
                                    <input
                                        type="text"
                                        placeholder={`Step ${index + 1}`}
                                        value={step}
                                        onChange={(e) => handleStepChange(index, e.target.value)}
                                        required
                                        className="input-field"
                                    />
                                </div>
                            ))}
                            <button type="button" onClick={handleAddStep} className="button add-button">Add Step</button>
                        </div>

                        <button type="button" onClick={handleAddQuestion} className="button add-button">Add Question</button>
                    </div>
                ) : (
                    <p className="max-questions-message">Maximum number of questions reached.</p>
                )}

                <button 
                    type="submit" 
                    className="button submit-button"
                    disabled={!formData.numberOfQuestions || formData.questions.length !== parseInt(formData.numberOfQuestions)}
                >
                    Submit Test
                </button>
            </form>
        </div>
    );
};

export default ManMockTestForm;
