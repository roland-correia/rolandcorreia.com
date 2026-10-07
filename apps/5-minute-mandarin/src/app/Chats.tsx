// Group chats (one per class, like Beginners or Intermediate) and one-to-one chats
// between tutor and student. Text, photos and voice notes; a reply to any message;
// calls started by the tutor only. Only the tutor adds people to a group. A student
// can suggest someone, and the tutor approves or declines.

import { useEffect, useRef, useState } from 'preact/hooks';
import {
  useStore,
  userById,
  conversationsFor,
  sendMessage,
  startCall,
  addMember,
  requestMember,
  declineRequest,
} from './store';
import { relative, plural } from './format';
import { toast } from './toast';
import { Avatar } from './Avatar';
import { Modal } from './Modal';
import type { Conversation, Message, User, Zoom } from './types';

const preview = (m: Message | undefined) =>
  !m ? '' : m.call ? 'Started a call' : m.media?.kind === 'voice' ? 'Voice note' : m.media?.kind === 'image' ? 'Photo' : (m.text ?? '');

export function Chats({ user }: { user: User }) {
  const state = useStore();
  const mine = conversationsFor(state, user);
  const [openId, setOpenId] = useState<string | null>(() => new URLSearchParams(location.search).get('c'));
  const open = mine.find((c) => c.id === openId);

  const choose = (id: string | null) => {
    setOpenId(id);
    const url = new URL(location.href);
    if (id) url.searchParams.set('c', id);
    else url.searchParams.delete('c');
    history.replaceState(null, '', url);
  };

  const last = (c: Conversation) => state.messages.filter((m) => m.conversationId === c.id).pop();
  const titleOf = (c: Conversation) =>
    c.kind === 'group' ? c.name : userById(state, c.memberIds.find((m) => m !== user.id)!)!.name;

  const section = (label: string, list: Conversation[]) =>
    list.length > 0 && (
      <>
        <h2 class="chat-list-title">{label}</h2>
        <ul class="chat-list">
          {list.map((c) => {
            const m = last(c);
            return (
              <li>
                <button type="button" class={`chat-item ${c.id === openId ? 'active' : ''}`} onClick={() => choose(c.id)} aria-current={c.id === openId ? 'true' : undefined}>
                  <span class="chat-item-top">
                    <b>{titleOf(c)}</b>
                    {c.level && <span class="chip">{c.level}</span>}
                  </span>
                  <small>
                    {m ? `${m.authorId === user.id ? 'You' : userById(state, m.authorId)!.short}: ${preview(m)}` : 'No messages yet'}
                  </small>
                </button>
              </li>
            );
          })}
        </ul>
      </>
    );

  return (
    <div class={`chats ${open ? 'has-open' : ''}`}>
      <nav class="chat-side" aria-label="Chats">
        <h1 class="chat-h1">Chats</h1>
        {section('Groups', mine.filter((c) => c.kind === 'group'))}
        {section(user.role === 'tutor' ? 'Students' : 'Your tutor', mine.filter((c) => c.kind === 'direct'))}
      </nav>
      {open ? (
        <Thread conversation={open} title={titleOf(open)} user={user} onBack={() => choose(null)} key={open.id} />
      ) : (
        <div class="chat-empty">
          <p class="meta">Choose a chat.</p>
        </div>
      )}
    </div>
  );
}

function Thread({ conversation, title, user, onBack }: { conversation: Conversation; title: string; user: User; onBack: () => void }) {
  const state = useStore();
  const messages = state.messages.filter((m) => m.conversationId === conversation.id);
  const isTutor = conversation.tutorId === user.id;
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showMembers, setShowMembers] = useState(false);
  const [call, setCall] = useState<Zoom | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const listRef = useRef<HTMLOListElement>(null);

  // Keep the newest message in view.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages.length]);

  const jumpTo = (id: string) => {
    document.getElementById(`m-${id}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    setHighlight(id);
    setTimeout(() => setHighlight(null), 1600);
  };

  const others = conversation.memberIds.filter((m) => m !== user.id).map((m) => userById(state, m)!);

  return (
    <section class="thread" aria-labelledby="thread-title">
      <header class="thread-head">
        <button type="button" class="iconbtn back-btn" onClick={onBack}>
          Back
        </button>
        <div class="thread-title">
          <h2 id="thread-title">{title}</h2>
          <button type="button" class="linkbtn" onClick={() => setShowMembers(!showMembers)} aria-expanded={showMembers}>
            {conversation.kind === 'group' ? plural(conversation.memberIds.length, 'member') : others[0].role === 'tutor' ? 'Your tutor' : 'Student'}
          </button>
        </div>
        {isTutor && (
          <button
            type="button"
            class="btn small"
            onClick={() => {
              startCall(conversation.id, user.id);
              toast(conversation.kind === 'group' ? 'Call started. Everyone in the group can join from the chat.' : 'Call started.');
            }}
          >
            Start call
          </button>
        )}
      </header>

      {showMembers && <Members conversation={conversation} user={user} />}

      <ol class="messages" ref={listRef} aria-label={`Messages in ${title}`}>
        {messages.map((m) => {
          const author = userById(state, m.authorId)!;
          const quoted = m.replyTo ? state.messages.find((q) => q.id === m.replyTo) : undefined;
          const own = m.authorId === user.id;
          return (
            <li id={`m-${m.id}`} class={`msg ${own ? 'own' : ''} ${highlight === m.id ? 'flash' : ''}`} key={m.id}>
              {!own && <Avatar user={author} size="sm" />}
              <div class="bubble">
                <p class="msg-meta">
                  <b>{own ? 'You' : author.name}</b>
                  {author.role === 'tutor' && <span class="chip chip-tutor">Tutor</span>}
                  <time dateTime={m.at}>{relative(m.at)}</time>
                </p>
                {quoted && (
                  <button type="button" class="quote" onClick={() => jumpTo(quoted.id)}>
                    <b>{userById(state, quoted.authorId)!.name}</b>
                    <span>{preview(quoted)}</span>
                  </button>
                )}
                {m.text && <p class="msg-text">{m.text}</p>}
                {m.media?.kind === 'image' &&
                  (m.media.url ? <img src={m.media.url} alt={m.media.name ?? 'Photo'} /> : <p class="meta">Photo (not kept in this prototype)</p>)}
                {m.media?.kind === 'voice' &&
                  (m.media.url ? (
                    <audio controls src={m.media.url} aria-label={`Voice note from ${author.name}`} />
                  ) : (
                    <p class="meta">Voice note (not kept in this prototype)</p>
                  ))}
                {m.call && (
                  <div class="call-card">
                    <p>
                      <b>{author.name} started a call</b>
                    </p>
                    <p class="meta">
                      Zoom meeting {m.call.meetingId}, passcode {m.call.passcode}
                    </p>
                    <button type="button" class="btn small" onClick={() => setCall(m.call!)}>
                      Join call
                    </button>
                  </div>
                )}
                <button type="button" class="reply-btn" onClick={() => setReplyTo(m)} aria-label={`Reply to ${author.name}`}>
                  Reply
                </button>
              </div>
            </li>
          );
        })}
      </ol>

      <Composer conversation={conversation} user={user} replyTo={replyTo} onReplied={() => setReplyTo(null)} />

      {call && (
        <Modal title="Join call" onClose={() => setCall(null)}>
          <dl class="zoom">
            <dt>Meeting ID</dt>
            <dd>{call.meetingId}</dd>
            <dt>Passcode</dt>
            <dd>{call.passcode}</dd>
          </dl>
          <p class="notice">Zoom is not connected yet. Once it is, this opens the call in Zoom.</p>
        </Modal>
      )}
    </section>
  );
}

function Composer({ conversation, user, replyTo, onReplied }: { conversation: Conversation; user: User; replyTo: Message | null; onReplied: () => void }) {
  const state = useStore();
  const [text, setText] = useState('');
  const [recording, setRecording] = useState<{ stop: (send: boolean) => void; started: number } | null>(null);
  const [seconds, setSeconds] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (replyTo) inputRef.current?.focus();
  }, [replyTo]);

  useEffect(() => {
    if (!recording) return;
    const timer = setInterval(() => setSeconds(Math.round((Date.now() - recording.started) / 1000)), 250);
    return () => clearInterval(timer);
  }, [recording]);

  const send = (content: Parameters<typeof sendMessage>[2]) => {
    sendMessage(conversation.id, user.id, { ...content, replyTo: replyTo?.id });
    onReplied();
  };

  const submit = (e?: Event) => {
    e?.preventDefault();
    if (!text.trim()) return;
    send({ text: text.trim() });
    setText('');
  };

  const record = async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      toast('This browser cannot record voice notes.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      const started = Date.now();
      let keep = true;
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        if (!keep || chunks.length === 0) return;
        const blob = new Blob(chunks, { type: recorder.mimeType });
        send({ media: { kind: 'voice', url: URL.createObjectURL(blob), seconds: Math.round((Date.now() - started) / 1000) } });
      };
      recorder.start();
      setSeconds(0);
      setRecording({
        started,
        stop: (send) => {
          keep = send;
          recorder.stop();
        },
      });
    } catch {
      toast('Microphone access was not allowed, so a voice note cannot be recorded.');
    }
  };

  const stop = (send: boolean) => {
    recording?.stop(send);
    setRecording(null);
  };

  const quotedAuthor = replyTo && userById(state, replyTo.authorId);

  return (
    <form class="composer" onSubmit={submit}>
      {replyTo && quotedAuthor && (
        <div class="replying">
          <span>
            Replying to <b>{quotedAuthor.id === user.id ? 'yourself' : quotedAuthor.name}</b>: {preview(replyTo).slice(0, 80)}
          </span>
          <button type="button" class="linkbtn" onClick={onReplied}>
            Cancel reply
          </button>
        </div>
      )}
      {recording ? (
        <div class="recording" role="status">
          <span class="rec-dot" aria-hidden="true" /> Recording voice note, {seconds}s
          <button type="button" class="btn small" onClick={() => stop(true)}>
            Send voice note
          </button>
          <button type="button" class="btn ghost small" onClick={() => stop(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <div class="composer-row">
          <label class="iconbtn file-btn" title="Send a photo">
            <span class="visually-hidden">Send a photo</span>
            <span aria-hidden="true">Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const input = e.target as HTMLInputElement;
                const file = input.files?.[0];
                if (file) send({ media: { kind: 'image', url: URL.createObjectURL(file), name: file.name } });
                input.value = '';
              }}
            />
          </label>
          <button type="button" class="iconbtn" onClick={record}>
            Voice
          </button>
          <textarea
            ref={inputRef}
            rows={1}
            value={text}
            placeholder="Write a message. 中文 or English"
            aria-label="Message"
            onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) submit(e);
            }}
          />
          <button class="btn small" disabled={!text.trim()}>
            Send
          </button>
        </div>
      )}
    </form>
  );
}

function Members({ conversation, user }: { conversation: Conversation; user: User }) {
  const state = useStore();
  const isTutor = conversation.tutorId === user.id;
  const members = conversation.memberIds.map((m) => userById(state, m)!);
  const outside = state.users.filter((u) => u.role === 'student' && !conversation.memberIds.includes(u.id));
  const requests = state.requests.filter((r) => r.groupId === conversation.id);
  const [pick, setPick] = useState('');

  return (
    <div class="members">
      <ul class="member-list">
        {members.map((m) => (
          <li>
            <Avatar user={m} size="sm" /> {m.name}
            {m.role === 'tutor' && <span class="chip chip-tutor">Tutor</span>}
          </li>
        ))}
      </ul>

      {conversation.kind === 'group' && (
        <>
          {isTutor && requests.length > 0 && (
            <div class="requests">
              <b>Waiting for you to approve</b>
              <ul>
                {requests.map((r) => (
                  <li>
                    <span>
                      {userById(state, r.requestedBy)!.name} suggested <b>{userById(state, r.studentId)!.name}</b>
                    </span>
                    <span class="row">
                      <button
                        type="button"
                        class="btn small"
                        onClick={() => {
                          addMember(conversation.id, r.studentId);
                          toast(`${userById(state, r.studentId)!.name} added to ${conversation.name}.`);
                        }}
                      >
                        Approve
                      </button>
                      <button type="button" class="btn ghost small" onClick={() => declineRequest(r.id)}>
                        Decline
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!isTutor && requests.filter((r) => r.requestedBy === user.id).length > 0 && (
            <p class="meta">
              Waiting for your tutor to approve:{' '}
              {requests
                .filter((r) => r.requestedBy === user.id)
                .map((r) => userById(state, r.studentId)!.name)
                .join(', ')}
            </p>
          )}

          {outside.length > 0 && (
            <form
              class="add-member"
              onSubmit={(e) => {
                e.preventDefault();
                if (!pick) return;
                const name = userById(state, pick)!.name;
                if (isTutor) {
                  addMember(conversation.id, pick);
                  toast(`${name} added to ${conversation.name}.`);
                } else {
                  requestMember(conversation.id, pick, user.id);
                  toast(`Asked your tutor to add ${name}.`);
                }
                setPick('');
              }}
            >
              <label class="field">
                <span>{isTutor ? 'Add a student' : 'Suggest someone. Your tutor approves it.'}</span>
                <select value={pick} onChange={(e) => setPick((e.target as HTMLSelectElement).value)}>
                  <option value="">Choose a student</option>
                  {outside.map((u) => (
                    <option value={u.id}>{u.name}</option>
                  ))}
                </select>
              </label>
              <button class="btn small" disabled={!pick}>
                {isTutor ? 'Add' : 'Ask tutor'}
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
