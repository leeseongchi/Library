/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const inputBox = css`
    box-sizing: border-box;
    border: none;
    outline: none;
    padding: 0px 10px;
    width: 100%;
    height: 100%;
`;

function BookRegisterInput({ value, onChange, onKeyDown, bookref }) {
    return (
        <input
            css={inputBox}
            type="text"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            ref={bookref}
        />
    );
}

export default BookRegisterInput;