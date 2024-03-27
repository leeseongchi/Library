/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import * as s from "./style";
import Select from 'react-select';
import { useReactSelect } from "../../hooks/useReactSelect";
import { useBookRegisterInput } from "../../hooks/useBookRegisterInput";
import { useQuery } from "react-query";
import { getBookCountRequest, searchBooksRequest } from "../../apis/api/bookApi";
import { useSearchParams } from "react-router-dom";
import AdminBookSearchPageNumbers from "../AdminBookSearchPageNumbers/AdminBookSearchPageNumbers";

function AdminBookSearch({ selectStyle, bookTypeOptions, categoryOptions }) {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const searchCount = 20;
    const [ bookList, setBookList ] = useState([]);

    const searchBooksQuery = useQuery(
        ["searchBooksQuery", searchParams.get("page")],
        async () => await searchBooksRequest({
            page: searchParams.get("page"),
            count: searchCount,
            bookTypeId: selectedBookType.option.value,
            categoryId: selectedCategory.option.value,
            searchTypeId: selectedSearchType.option.value,
            searchText: searchText.value
        }),
        {
            refetchOnWindowFocus: false,
            onSuccess: response => {
                setBookList(() => response.data.map(book => {
                    return {
                        ...book,
                        checked: false
                    }
                }));
            }
        }
    );

    const getBookCountQuery = useQuery(
        ["getBookCountQuery", searchBooksQuery.data],
        async () => await getBookCountRequest({
            count: searchCount,
            bookTypeId: selectedBookType.option.value,
            categoryId: selectedCategory.option.value,
            searchTypeId: selectedSearchType.option.value,
            searchText: searchText.value
        }),
        {
            refetchOnWindowFocus: false,
            onSuccess: response => {
                console.log(response);
            }
        }
    );

    const searchSubmit = () => {
        setSearchParams({
            page: 1
        })
        searchBooksQuery.refetch();
    }

    const selectedBookType = useReactSelect({ value: 0, label: "전체" });
    const selectedCategory = useReactSelect({ value: 0, label: "전체" });
    const selectedSearchType = useReactSelect({ value: 0, label: "전체" });
    const searchText = useBookRegisterInput(searchSubmit);

    const searchTypeOptions = [
        { value: 0, label: "전체" },
        { value: 1, label: "도서명" },
        { value: 2, label: "저자명" },
        { value: 3, label: "출판사" },
        { value: 4, label: "ISBN" }
    ];

    const selectStyle2 = {
        control: baseStyles => ({
            ...baseStyles,
            borderRadius: "0px",
            border: "none",
            borderRight: "1px solid #dbdbdb",
            outline: "none",
            boxShadow: "none"
        })
    }

    const handleCheckAllChange = (e) => {
       
    }

    const handleCheckOnChange = (e) => {
        const bookId = e.target.value;

        setBookList(() => bookList.map(book => {
            if(book.bookId === parseInt(bookId)) {
                return {
                    ...book,
                    checked: e.target.checked
                } 
            }else {
                return {
                    ...book
                }
            }
        }));
    }

    return (
        <div>
            <div css={s.searchBar}>
                <Select
                    styles={selectStyle2}
                    options={[{ value: 0, label: "전체" }, ...bookTypeOptions]}
                    defaultValue={selectedBookType.defaultValue}
                    value={selectedBookType.option}
                    onChange={selectedBookType.handleOnChange}
                />
                <Select
                    styles={selectStyle2}
                    options={[{ value: 0, label: "전체" }, ...categoryOptions]}
                    defaultValue={selectedCategory.defaultValue}
                    value={selectedCategory.option}
                    onChange={selectedCategory.handleOnChange}
                />
                <Select
                    styles={selectStyle}
                    options={searchTypeOptions}
                    defaultValue={selectedSearchType.defaultValue}
                    value={selectedSearchType.option}
                    onChange={selectedSearchType.handleOnChange}
                />
                <input 
                    css={s.searchInput} 
                    type="text" 
                    value={searchText.value}
                    onChange={searchText.handleOnChange}
                    onKeyDown={searchText.handleOnKeyDown}
                />
                <button css={s.searchButton} onClick={() => searchSubmit()}>검색</button>
            </div>
            <div css={s.tableLayout}>
                <table css={s.table}>
                    <thead>
                        <tr css={s.theadTr}>
                            <th><input type="checkbox" checked={checkAll} onChange={handleCheckAllChange}/></th>
                            <th>코드번호</th>
                            <th>도서명</th>
                            <th>저자명</th>
                            <th>출판사명</th>
                            <th>ISBN</th>
                            <th>도서형식</th>
                            <th>카테고리</th>
                            <th>표지URL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            bookList.map(
                                (book, index) =>
                                <tr key={book.bookId}>
                                    <td><input type="checkbox" value={book.bookId} checked={book.checked} onChange={handleCheckOnChange}/></td>
                                    <td>{book.bookId}</td>
                                    <td>{book.bookName}</td>
                                    <td>{book.authorName}</td>
                                    <td>{book.publisherName}</td>
                                    <td>{book.isbn}</td>
                                    <td>{book.bookTypeName}</td>
                                    <td>{book.categoryName}</td>
                                    <td>{book.coverImgUrl}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
            {
                !getBookCountQuery.isLoading &&
                <AdminBookSearchPageNumbers bookCount={getBookCountQuery.data?.data}/>
            }
        </div>
    );
}

export default AdminBookSearch;
