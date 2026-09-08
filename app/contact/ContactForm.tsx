'use client';
import { FormEvent, useState } from 'react';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');

    const form = e.currentTarget;
    const data = {
      access_key: '4b34fdfc-206f-4181-b31d-369e545623e5',
      subject: `New contact form submission — ${(form.elements.namedItem('category') as HTMLSelectElement)?.value ?? 'General'}`,
      from_name: 'Adrentuary Gaming Contact Form',
      discordName:   (form.elements.namedItem('discordName')   as HTMLInputElement).value,
      preferredName: (form.elements.namedItem('preferredName') as HTMLInputElement).value,
      discordId:     (form.elements.namedItem('discordId')     as HTMLInputElement).value,
      email:         (form.elements.namedItem('email')         as HTMLInputElement).value,
      category:      (form.elements.namedItem('category')      as HTMLSelectElement).value,
      message:       (form.elements.namedItem('message')       as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>
        Discord Username*
        <input name="discordName" required placeholder="Enter your username" />
      </label>
      <label>
        Preferred Name / Pronouns
        <input name="preferredName" placeholder="Answer in a few words" />
      </label>
      <label>
        Discord User ID*
        <input name="discordId" required placeholder="Enter your User ID" />
      </label>
      <label>
        Email Address*
        <input name="email" type="email" required placeholder="email@example.com" />
        <small>This will be the primary contact method if Discord information isn&apos;t provided.</small>
      </label>
      <label>
        Category*
        <select name="category" required defaultValue="">
          <option value="" disabled>Select a category</option>
          <option>Suggestion or new idea</option>
          <option>Correction</option>
          <option>Accessibility</option>
          <option>Technical issue</option>
          <option>Collaboration</option>
          <option>Other</option>
        </select>
      </label>
      <label className="contact-form__wide">
        Message*
        <textarea name="message" required placeholder="Type your feedback here..." rows={5} />
      </label>
      <button className="button button--primary" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending\u2026' : <>Submit <span>&#x2197;</span></>}
      </button>
      {status === 'success' && (
        <p className="form-status" role="status">
          Thanks! Your message has been sent. I&apos;ll get back to you as soon as possible.
        </p>
      )}
      {status === 'error' && (
        <p className="form-status form-status--error" role="alert">
          Something went wrong. Please try again or reach out directly on Discord.
        </p>
      )}
    </form>
  );
}
