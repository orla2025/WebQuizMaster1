package com.webquizmaster.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "videos")
@Data
@NoArgsConstructor
public class Video {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    private String filename;
    
    @Column(name = "video_url")
    private String videoUrl;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "video_type", nullable = false)
    private VideoType videoType = VideoType.FILE;
    
    @Column(name = "youtube_id")
    private String youtubeId;
    
    @Column(name = "upload_date")
    private LocalDateTime uploadDate;
    
    private Double duration;
    
    private Long filesize;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ElementCollection
    @CollectionTable(name = "video_tags")
    @Column(name = "tag")
    private List<String> tags;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @PrePersist
    protected void onCreate() {
        uploadDate = LocalDateTime.now();
    }
} 