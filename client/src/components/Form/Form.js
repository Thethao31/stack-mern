import React, { useState, useEffect } from 'react'
import { TextField, Button, Typography, Paper } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import FileBase from 'react-file-base64'
import { useHistory } from 'react-router-dom'
import ChipInput from 'material-ui-chip-input'

import { createPost, updatePost } from '../../actions/posts'
import useStyles from './styles'

const Form = ({ currentId, setCurrentId }) => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const history = useHistory()

    const user = JSON.parse(localStorage.getItem('profile'))

    const initStateData = {
        title: '', message: '', tags: [], selectedFile: ''
    }
    const [postData, setPostData] = useState(initStateData)

    // lấy cái postId đó để update
    const post = useSelector((state) => (
        currentId ? state.posts.posts.find((message) => 
            message._id === currentId) : null
        )
    )

    // clear gõ trên input và postId
    const clear = () => {
        setCurrentId(0)
        setPostData(initStateData)
    }

    // hàm chjay khi rerender để kiểm tra hết hạn đăng nhập chưa
    useEffect(() => {
        if (!post?.title) clear()
        if (post) setPostData(post)
    }, [post])

    // thêm hoặc chỉnh sửa bài post
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (currentId === 0) {
            dispatch(createPost({ ...postData, name: user?.result?.name }, history.push('/')))
            clear()
        } else {
            dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }))
            clear()
        }
    }

    // check xem đã đăng nhập chưa
    if (!user?.result?.name) {
        return (
            <Paper className={classes.paper} elevation={6}>
                <Typography variant="h6" align="center">
                    Please Sign In to create your own memories and like other's memories.
                </Typography>
            </Paper>
        )
    }

    // thêm các tags
    const handleAddChip = (tag) => {
        setPostData({ ...postData, tags: [...postData.tags, tag] })
    }

    // xóa các tags
    const handleDeleteChip = (chipToDelete) => {
        setPostData({ ...postData, tags: postData.tags.filter((tag) => tag !== chipToDelete) })
    }

    return (
        <Paper className={classes.paper} elevation={6}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <Typography variant="h6">{currentId ? `Editing "${post?.title}"` : 'Creating a Memory'}</Typography>
                <TextField 
                    name="title" 
                    variant="outlined" 
                    label="Title" 
                    fullWidth 
                    value={postData.title} 
                    onChange={(e) => setPostData({ ...postData, title: e.target.value })} 
                />
                <TextField 
                    name="message" 
                    variant="outlined" 
                    label="Message" 
                    fullWidth 
                    multiline 
                    rows={4} 
                    value={postData.message} 
                    onChange={(e) => setPostData({ ...postData, message: e.target.value })} 
                />
                <div style={{ padding: '5px 0', width: '94%' }}>
                    <ChipInput
                        name="tags"
                        variant="outlined"
                        label="Tags"
                        fullWidth
                        value={postData.tags}
                        onAdd={(chip) => handleAddChip(chip)}
                        onDelete={(chip) => handleDeleteChip(chip)}
                    />
                </div>
                <div 
                    className={classes.fileInput}><FileBase 
                    type="file" 
                    multiple={false} 
                    onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} />
                </div>
                <Button 
                    className={classes.buttonSubmit} 
                    variant="contained" 
                    color="primary" 
                    size="large" 
                    type="submit" 
                    fullWidth>
                    Submit
                </Button>
                <Button 
                    variant="contained" 
                    color="secondary" 
                    size="small" 
                    onClick={clear} 
                    fullWidth>
                    Clear
                </Button>
            </form>
        </Paper>
    )
}

export default Form
