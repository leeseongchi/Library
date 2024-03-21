/** @jsxImportSource @emotion/react */
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as s from "./style";
import { sendAuthMailRequest } from "../../apis/api/sendAuthMail.js";
import FullSizeLoader from "../../components/FullSizeLoader/FullSizeLoader";
import { GoCheckCircle } from "react-icons/go";

function MyPage() {
    const queryClient = useQueryClient();
    const principalData = queryClient.getQueryData("principalQuery");
    
    const sendAuthMailMutation = useMutation({
        mutationKey: "sendAuthMailMutation",
        mutationFn: sendAuthMailRequest,
        retry: 0,
        onSuccess: (response) => {
            if(response.data) {
                alert("메일 전송을 완료하였습니다.");
            }else {
                alert("메일 전송에 실패하였습니다.");
            }
        }
    });

    const handleSendAuthMailClick = () => {
        sendAuthMailMutation.mutate();
    }

    return (
        <>
            {
                sendAuthMailMutation.isLoading 
                ? <FullSizeLoader />
                : <div css={s.layout}>
                    <div css={s.header}>
                        <div css={s.imgBox}>
                            <div css={s.profileImg}>
                                <img src="https://i.namu.wiki/i/HE0YxX9W3TzH8kTUq475AihPuHZB8P88N_JLNXT-OZoFmIFpZ5lcV_IPUXbqHe5rD1xxSbcLMk3Q_sizFUnKbBOVwZG5hlYtzEqaRjHkxBYfZMtmQP7D5MSxiuWgVMNOSgylyAcvtyWtk9_Hut4Xgg.webp" alt="" />
                            </div>
                        </div>
                        <div css={s.infoBox}>
                            <div css={s.infoText}>사용자이름: {principalData.data.username}</div>
                            <div css={s.infoText}>이름: {principalData.data.name}</div>
                            <div css={s.emailBox}>
                                <div css={s.infoText}>이메일: {principalData.data.email}</div>
                                {
                                    principalData.data.authorities.filter(auth => auth.authority === "ROLE_USER").length === 0 
                                    ?
                                    <button css={s.infoButton} onClick={handleSendAuthMailClick}>인증하기</button>
                                    :
                                    <div css={s.emailCheck}><GoCheckCircle /></div>
                                }
                            </div>
                            <div css={s.infoButtons}>
                                <button css={s.infoButton}>정보 수정</button>
                                <button css={s.infoButton}>비밀번호 수정</button>
                            </div>
                        </div>
                    </div>
                    <div css={s.bottom}>

                    </div>
                </div>
            }
        </>
    );
}

export default MyPage;