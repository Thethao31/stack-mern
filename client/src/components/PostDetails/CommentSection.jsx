import React, { useState, useRef } from 'react'
import { Typography, TextField, Button } from '@material-ui/core/'
import { useDispatch } from 'react-redux'

import { commentPost } from '../../actions/posts'
import useStyles from './styles'

const CommentSection = ({ post }) => {
    const dispatch = useDispatch()
    const classes = useStyles()
    
    const user = JSON.parse(localStorage.getItem('profile'))

    // comments từ database
    const [comments, setComments] = useState(post?.comments)
    // comment từ nhập dữ liệu
    const [comment, setComment] = useState('')

    // chức năng tự động cuộn xuống dưới khi comment mới nhất đc add
    const commentsRef = useRef()

    // thêm comment
    const handleComment = async () => {
        const newComment = `${user?.result?.name}: ${comment}`
        const newComments = await dispatch(commentPost(newComment, post._id))

        setComment('')
        setComments(newComments)

        commentsRef.current.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div>
            <div className={classes.commentsOuterContainer}>
                <div className={classes.commentsInnerContainer}>
                    <Typography gutterBottom variant="h6">Comments</Typography>
                    {comments?.map((c, i) => (
                        <Typography key={i} gutterBottom variant="subtitle1">
                            {/* [0] là tên user */}
                            <strong>{c.split(': ')[0]}</strong>
                            {/* [1] là comment của user đó */}
                            {c.split(':')[1]}
                        </Typography>
                    ))}
                <div ref={commentsRef} />
                </div>
                <div style={{ width: '70%' }}>
                <Typography gutterBottom variant="h6">Write a comment</Typography>
                <TextField 
                    fullWidth 
                    rows={4} 
                    variant="outlined" 
                    label="Comment" 
                    multiline 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)}
                />
                <br />
                <Button 
                    style={{ marginTop: '10px' }} 
                    fullWidth 
                    disabled={!comment.length} 
                    color="primary" 
                    variant="contained" 
                    onClick={handleComment}
                >
                    Comment
                </Button>
                </div>
            </div>
        </div>
    )
}

export default CommentSection
