import GetScheduleDto from "../domain/schedule/getScheduleDto";
import React, {Dispatch, SetStateAction, useState} from "react";
import {Accordion, Badge, Button, ButtonGroup, Card, FormControl, InputGroup, ListGroup} from "react-bootstrap";
import Common from "./common";
import ScheduleService from "../service/scheduleService";
import ScheduleInterface from "../domain/schedule/scheduleInterface";
import GetHisCodeDto from "../domain/schedule/getHisCodeDto";
import notificationIcon from '../notifications_active_black_24dp.svg'

interface ScheduleFormProps {
    getSchedule: GetScheduleDto,
    modal: any,
    setModal: Dispatch<SetStateAction<any>>,
    toggleIncomplete: () => void,
    requestGetSchedule: () => void,
    showIncomplete: boolean
}

const scheduleService = new ScheduleService()
const ScheduleForm: React.FC<ScheduleFormProps> = ({
                                                       getSchedule,
                                                       setModal,
                                                       modal,
                                                       requestGetSchedule,
                                                       toggleIncomplete,
                                                       showIncomplete
                                                   }) => {
    const [lastUpdated] = useState(new Date().toLocaleString())
    const showHisModal = async (v: ScheduleInterface) => {
        const videoResponse = await scheduleService.getVideo(v.kjKey, v.seq, v.item)
        const requestHisStatus = (his: number) => {
            scheduleService.requestHisStatus(v.kjKey, v.seq, v.item, his).then(responseCode => {
                if (responseCode === 200) requestGetSchedule()
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        const notification = new Notification(v.name, {
                            body: responseCode === 200 ? `[id:${v.item}] HIS request sent.` : `[id:${v.item}] error occurred.`,
                            image: '/logo512.png',
                            icon: '/logo512.png'
                        })
                        notification.onshow = () => setTimeout(() => notification.close(), 3000)
                    } else {
                        alert(responseCode === 200 ? `[id:${v.item}] HIS request sent.` : `[id:${v.item}] error occurred.`)
                    }
                })
            })
        }
        const makeTimerHisNoti = (his: number) => Notification.requestPermission().then(r => {
            if (r === 'granted') {
                const times = v.progressStr
                    .split('/ ')[1].replace(/[^0-9]/g, ":").split(':').map(v => parseInt(v, 10))
                const time = times.length === 4 ? times[0] * 3600000 + (times[1] + 1) * 60000 : (times[0] + 1) * 60000
                const addNotify = new Notification(v.name, {
                    body: `[id:${v.item}] HIS request alarm(after ${time}ms) added.`,
                    image: '/logo512.png',
                    icon: '/logo512.png'
                })
                addNotify.onshow = () => setTimeout(() => addNotify.close(), 7000)
                setTimeout(() => {
                    const notification = new Notification(v.name, {
                        body: `[id:${v.item}] needs HIS status request.`,
                        image: '/logo512.png',
                        icon: '/logo512.png'
                    })
                    requestHisStatus(his)
                    notification.onshow = () => {
                        new Audio('/notification.ogg').play()
                    }
                    notification.onclick = async () => {
                        makeModal(await scheduleService.getHisCode(v.kjKey, v.seq, v.item))
                        notification.close()
                    }
                }, time)
            }
        })
        const reissueHisResponse = () => {
            scheduleService.reissueHis(v.kjKey, v.seq, v.item).then(async () => {
                makeModal(await scheduleService.getHisCode(v.kjKey, v.seq, v.item))
            })
        }
        const makeModal = (his: GetHisCodeDto) => setModal({
            ...modal, show: true, title: 'Content Management', body: (
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        Search by id:{v.item}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        Name: {v.name}<br/>
                        EClassID: {v.kjKey}<br/>
                        View state: {v.progressStr} ({v.percent})
                    </ListGroup.Item>
                    <ListGroup.Item className={'p-1'}>
                        <InputGroup size="sm">
                            <Button
                                onClick={() => window.open(`https://pknu.commonscdn.com/contents5/pknu100001/${videoResponse.cid}/contents/media_files/mobile/ssmovie.mp4`)}
                                variant={"outline-secondary"}>ContentUrl</Button>
                            <FormControl size={"sm"} disabled
                                         value={`https://pknu.commonscdn.com/contents5/pknu100001/${videoResponse.cid}/contents/media_files/mobile/ssmovie.mp4`}/>
                        </InputGroup>
                        <InputGroup size="sm" className={'mt-1'}>
                            <Button
                                onClick={() => window.open(`https://ucc.pknu.ac.kr/em/${videoResponse.cid}`)}
                                variant={"outline-secondary"}>ContentVideo</Button>
                            <FormControl size={"sm"} disabled
                                         value={`https://ucc.pknu.ac.kr/em/${videoResponse.cid}`}/>
                        </InputGroup>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        hisCode: {his.hisCode}<br/>
                        created: {new Date(his.timestamp).toLocaleString()}<br/>
                        <Button onClick={() => makeTimerHisNoti(his.hisCode)} variant={"outline-dark"}
                                className={'mt-2'} size={"sm"}>
                            <img src={notificationIcon} alt={'set alarm'} width={18}/>
                        </Button>{' '}
                        <Button onClick={() => requestHisStatus(his.hisCode)} className={'mt-2'}
                                variant={"outline-primary"} size={"sm"}>Make Request</Button>{' '}
                        <Button onClick={reissueHisResponse} className={'mt-2'} variant={"outline-warning"} size={"sm"}>Reissue
                            hisCode</Button>
                        <br/>
                        <span className={'text-muted'}>* Alarm dismiss when page refreshed.</span>
                    </ListGroup.Item>
                </ListGroup>
            )
        })
        makeModal(await scheduleService.getHisCode(v.kjKey, v.seq, v.item))
    }
    return (
        <>
            <Card border={"dark"}>
                <Card.Header>
                    Schedule
                </Card.Header>
                <Card.Body>
                    Last updated in {lastUpdated}
                </Card.Body>
            </Card>
            <Common.Blank/>
            <ButtonGroup size={"sm"}>
                <Button disabled={showIncomplete} onClick={toggleIncomplete} variant="outline-dark">Only
                    Incomplete</Button>
                <Button disabled={!showIncomplete} onClick={toggleIncomplete} variant="outline-dark">All</Button>
            </ButtonGroup>
            <Button onClick={requestGetSchedule} className={'ms-2'} variant="outline-dark" size={"sm"}>Reload</Button>
            <Common.Blank/>
            <Accordion>
                {getSchedule.courses.map((v, i) => (
                    <Accordion.Item eventKey={i.toString()}>
                        <Accordion.Header>
                            <span className={'me-1'}>{v.title}</span>
                            <small className={'me-2 text-muted'}>{v.id}</small>
                            <Badge pill>{v.incomplete.length}</Badge>
                        </Accordion.Header>
                        <Accordion.Body>
                            {v.incomplete.map((v, i) => (
                                <>
                                    {i !== 0 ? <Common.Blank/> : null}
                                    <ListGroup>
                                        <ListGroup.Item>
                                            <span><Badge pill>{v.edDt}</Badge>{' '}[{v.seq}] {v.name}</span>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            View state: {v.progressStr}
                                            <small className={'ms-3 text-muted'} onClick={() => showHisModal(v)}>
                                                ID: {v.item}
                                            </small>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </>
                            ))}
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        </>
    );
}

export default ScheduleForm
